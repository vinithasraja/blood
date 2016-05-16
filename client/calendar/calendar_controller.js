(() => {
  app.controller('CalendarController', ['$scope','$rootScope', '$controller', '$http', '$window', '$routeParams', 'Calendar', 'Event', 'Feed', 'Buddy' ,function($scope, $rootScope, $controller, $http, $window, $routeParams, Calendar, Event,Feed,Buddy) {
    let CalendarCtrl = this;
    let $calendar = $('#calendar');
//blood buddy
    CalendarCtrl.buddy= false;
    CalendarCtrl.time = {};

    $calendar.fullCalendar({
      timezone: 'local',
      displayEventEnd: true,
      events: (start, end, timezone, callback) => {
        Calendar.getCalendarEvents().then(res => {
          CalendarCtrl.isLoggedin = true;
          CalendarCtrl.googleEvents = res.data;
          CalendarCtrl.fillCalendar(callback);
        }).catch(err => {
          CalendarCtrl.isLoggedin = false;
          CalendarCtrl.googleEvents = [];
          CalendarCtrl.fillCalendar(callback);
        });
      },
      eventClick: (calEvent, jsEvent, view) => {
        if (CalendarCtrl.isHospital) {
          $window.open(`/profile/${calEvent.datum.donorId}`, '_blank');
          return;
        }

        // this should be less hack-ish
        if (calEvent.title === 'Slot Available') {
          let $box1 = $('.modal.box1');
          let $box3 = $('.modal.box3');
          CalendarCtrl.setView(calEvent);
          $scope.$apply();
  //blood buddy
          if(CalendarCtrl.buddy){
            $box3.modal();
          } else {
            $box1.modal();
          }
        }
        // same here
        if (calEvent.title === 'Your appointment') {
          $window.open(`/hospital/profile/${$routeParams.hospitalid}`, '_blank');
        }
      }
    });

    CalendarCtrl.googleSignin = () => {
      Calendar.getUrl().then(res => {
        let newWindow = $window.open(res.data, 'AuthPage', 'width=500px,height=700px');
        // e.data is a string with the code
        $window.onmessage = (e) => {
          let index = e.data.lastIndexOf('code=');
          let code = e.data.substring(index + 5).replace('#', '');
          newWindow.close();
          Calendar.getToken(code).then(res => {
            $calendar.fullCalendar('refetchEvents');
          });
        };
      });
    };

    CalendarCtrl.fillCalendar = (callback) => {
      // this is hacky currently and can be optimized
      $calendar.fullCalendar('removeEvents');
      $calendar.fullCalendar('addEventSource', CalendarCtrl.googleEvents);
      CalendarCtrl.getAppointmentData(CalendarCtrl.checkOverlap, callback);
    };

    CalendarCtrl.reload = () => {
      $calendar.fullCalendar('refetchEvents');
    };

    CalendarCtrl.getAppointmentData = (checkOverlap, callback) => {
      Calendar.getHospitalProfile($routeParams.hospitalid).then(res => {
        if (!res.data) {
          callback(null);
          return console.log('no hospital id in params!');
        }
        let currentDate = new Date();
        let dayIndex, startHour, endHour;
        CalendarCtrl.appointments = _.flatten(_.range(31).map(counter => {
          currentDate = new Date(currentDate.getTime() + (1000 * 60 * 60 * 24));
          dayIndex = (currentDate.getDay() + 6) % 7;
          return {
            currentDate: currentDate,
            openhour: res.data.schedules[dayIndex].openhours,
            endhour: res.data.schedules[dayIndex].closehours,
          };
        }).filter(data => {
          return !!data.openhour;
        }).map(data => {
          return _.range(data.openhour, data.endhour).map(hour => {
            return {
              title: 'Slot Available',
              start: data.currentDate.setHours(hour, 0, 0, 0),
              backgroundColor: '#378006'
            };
          });
        }));
        checkOverlap(CalendarCtrl.appointments, CalendarCtrl.googleEvents);
        callback(CalendarCtrl.appointments);

      })
    };

    CalendarCtrl.checkOverlap = (appointments, googleEvents) => {
      for (let googleEvent of googleEvents) {
        let isOverlap = false;
        let startIndex = 0;
        let endIndex = appointments.length -1;
        let midIndex, appointment, start, end;

        while (!isOverlap && (startIndex <= endIndex)) {
          midIndex = Math.floor((startIndex + endIndex) / 2);
          startTime = new Date(googleEvent.start).getTime();
          endTime = new Date(googleEvent.end).getTime();
          appointmentTime = appointments[midIndex].start;

          if((appointmentTime >= startTime) && (appointmentTime <= endTime)) {
            isOverlap = true;
          } else if (appointmentTime < startTime) {
            startIndex = midIndex + 1;
          } else if (appointmentTime > endTime) {
            endIndex = midIndex - 1;
          } else {
            break;
          }
        }

        if (isOverlap) {
          CalendarCtrl.removeEventData(appointments, midIndex);
        }
      }
    };

    CalendarCtrl.createEvent = (startDate, endDate) => {
      startDate = startDate || CalendarCtrl.dateTime;
      endDate = endDate || CalendarCtrl.dateTime || startDate;

      Calendar.postCalendarEvent(startDate, endDate).then(res => {
        if (res.status === 201) {
          $calendar.fullCalendar('refetchEvents');
        }
      });
    };

    CalendarCtrl.removeEventData = (events, index) => {
      CalendarCtrl.appointments.splice(index, 1);
    };

    CalendarCtrl.setView = (calEvent) => {
      let month = calEvent.start.month();
      let day = calEvent.start.day();
      let hour = calEvent.start.hour();
      let minute = calEvent.start.minutes();
      minute = minute < 10 ? minute + '0' : minute;

      CalendarCtrl.time.start = calEvent.start;
      CalendarCtrl.time.end = calEvent.end;

      CalendarCtrl.time.print = `${month}/${day} @ ${hour}:${minute}`;
    };

    CalendarCtrl.firstModal = () => {
      let $box2 = $('.modal.box2');
      let $inputs = $('.modal').find('input');

      $inputs.each((index, input) => {
        input.checked = false;
      });

      $box2.modal();
    };
//blood buddy
    CalendarCtrl.buddyoneModal = () => {
      let $box4 = $('.modal.box4');
      let $inputs = $('.modal').find('input');

      $inputs.each((index, input) => {
        input.checked = false;
      });

      $box4.modal();
    };

    CalendarCtrl.buddytwoModal = () => {
      //share on fb
      let $input1 = $('.checkbox.input1').find('input');
      $("#fb-share-button").show();
      let $input3 = $('.checkbox.input3').find('input');
      CalendarCtrl.buddyRequest(CalendarCtrl.time.start, $routeParams.hospitalid, $input3);
    };
    CalendarCtrl.buddyRequest = (start, hospitalId, $input3) =>
    {
      Buddy.requestBuddy(start,hospitalId)
      .then(buddy => {
        if ($input3.is(':checked')) {
         let content = "Looking for a buddy on" + " " + CalendarCtrl.time.print +" " + "http://localhost:8080/#bloodbuddy/"+buddy.id ;
         Feed.submit(content, {latitude: $rootScope.latitude, longitude: $rootScope.longitude});
       };
         $window.location.assign(`#bloodbuddy/${buddy.id}`);



      });
    };

    //blood buddy

    CalendarCtrl.secondModal = () => {

      let $input1 = $('.checkbox.input1').find('input');
      let $input2 = $('.checkbox.input2').find('input');

      CalendarCtrl.createEvent(CalendarCtrl.time.start, CalendarCtrl.time.end);
      CalendarCtrl.processRequest($input1, $input2);
    };

    // this will need refactoring and modularizing!!
    CalendarCtrl.processRequest = ($input1, $input2) => {
      // save appointment
      $http.post('/api/appointment', {
        hospitalId: $routeParams.hospitalid,
        time: CalendarCtrl.time.start
      }).then(res => {
        console.log('appointment res: ', res);
      }).catch(err => {
        console.log('error: ', err);
      })

      // send email to both parties

      // share to facebook if checked
      if ($input1.is(':checked')) {
        console.log('todo: share on facebook');
      };

      // save event if checked
      if ($input2.is(':checked')) {
        $http.post('/api/event', {hospitalId: $routeParams.hospitalid}).then(res => {
          console.log('event res: ', res);
        }).catch(err => {
          console.log('error: ', err);
        })
      }
    }


  }]);
})();
