app.controller('HospitalProfileController', ['$window', '$routeParams' ,  '$rootScope', 'HospitalProfile', function($window, $routeParams, $rootScope, HospitalProfile) {
  let HospitalProfileCtrl = this;

  if ($routeParams.hospitalid) HospitalProfileCtrl.id = $routeParams.hospitalid;

  HospitalProfileCtrl.editObj = {};

  HospitalProfileCtrl.edit = false;
  HospitalProfileCtrl.Edit = function() {
    HospitalProfileCtrl.edit = !HospitalProfileCtrl.edit;
  };

  HospitalProfileCtrl.bloodTypes = [
  {display: 'A+', code: 'apos'},
  {display: 'A-', code: 'aneg'},
  {display: 'B+', code: 'bpos'},
  {display: 'B-', code: 'bneg'},
  {display: 'AB+', code: 'abpos'},
  {display: 'AB-', code: 'abneg'},
  {display: '0+', code: 'opos'},
  {display: 'O-', code: 'oneg'}
  ];

  HospitalProfileCtrl.schedule = [
    {
      
      day: 1,
      openhours: 9,
      closehours: 17,
    },
    { 
      
      day: 2,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 3,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 4,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 5,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 6,
      openhours: 9,
      closehours: 17,
    },
    {
      
      day: 7,
      openhours: 9,
      closehours: 17,
    }


  ];
 



  HospitalProfileCtrl.getlatlong = () => {
    let address = document.getElementById('address').value;
    console.log(address);
    // Initialize the Geocoder
    let geocoder = new google.maps.Geocoder();
    if (geocoder) {
      console.log(geocoder);

      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log(results);
          HospitalProfileCtrl.editObj.latitude = results[0].geometry.location.lat();
          HospitalProfileCtrl.editObj.longitude = results[0].geometry.location.lng();
        }
      });
    }
  };


  HospitalProfileCtrl.update = () => {
    HospitalProfileCtrl.editObj.schedules = HospitalProfileCtrl.schedule;
    console.log(HospitalProfileCtrl.editObj);
    HospitalProfile.update(HospitalProfileCtrl.editObj)
    .then(hospital => HospitalProfileCtrl.editObj = hospital);
  };

  let displayHospital = () => {
    HospitalProfile.get(HospitalProfileCtrl.id)
    .then((hospital) => {
      HospitalProfileCtrl.editObj = hospital;
    });
  };

  HospitalProfileCtrl.reviews = [];
  let getReviews = () => {
    if (HospitalProfileCtrl.id) {
      HospitalProfile.getReviews(HospitalProfileCtrl.id)
      .then(reviews => HospitalProfileCtrl.reviews = reviews);
    }
  };


  HospitalProfileCtrl.submitReview = () => {
    HospitalProfile.postReview(HospitalProfileCtrl.id, HospitalProfileCtrl.reviewContent)
    .then(getReviews);
  };

  displayHospital();
  getReviews();
}]);
