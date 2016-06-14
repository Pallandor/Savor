    // ADDED R.S 
    app.service('uber', function uberService($state, $window, $http, geolocation, $rootScope) {
        var self = this;

        self.getUserLocation = function(callback){
          console.log("Tried to get user's current location!"); 
           geolocation.getLocation().then(function(data){
            callback({
              lat:data.coords.latitude, 
              long:data.coords.longitude
            }); 
          });
        };

        self.getUberProducts = function(callback){
          this.getUserLocation(function(locationObj){

            // just store it in localStorage or rootScope
            $rootScope.userLocationObj = locationObj; 

            $http.post('/api/uberproducts', {
              latitude: locationObj.lat,
              longitude: locationObj.long
            }).then(function(response){
              console.log('Successfully used getUberProducts in uber.service!'); 
              callback(response.data.products); 
            })
          });
        };

        self.orderUberRide = function(startLocation, endLocation, product_id, callback){
          // what's required? send to server-api!
          // actually, better make the request from client wiht UBERapi, otherwise will order a real ride! 
          debugger; // see if values are correct! 
          $http.put('https://sandbox-api.uber.com/v1/sandbox/products/' + product_id, {
            start_latitude: startLocation.lat,
            start_longitude: startLocation.long,
            end_latitude: endLocation.latitude,
            end_longitude: endLocation.longitude,
            product_id: product_id
          },
          {
              headers: {
                'Authorization': 'Bearer ' + window.location['accessToken']
              }
          }).then(function(response){
            console.log("uber ride ordered!"); 
            callback(response); 
          }); 
        }; 

        self.saveToken = function(accessToken) {
            window.localStorage.setItem('accessToken', accessToken);
            console.log('uberService saveToken invoked!'); 
        };

        self.goToUberPage = function(restaurantLocationObj) {
            // if no token currently stored, redirect them to server login route
            if (!window.localStorage['accessToken']) {
              console.log('No Access Token found! Assume user has not logged in to Uber!'); 
                var baseUrl = $window.location.origin;
                $window.location.href = baseUrl + '/api/uberlogin';
            }
            // otherwise, take them to the Uber Trip Page 
            else {
                console.log('Access Token found in localStorage! Now taking them to Uber Trip Page!'); 
                $rootScope.restaurantLocationObj = restaurantLocationObj;
                $state.go('uber'); 
            }
        };

    });
