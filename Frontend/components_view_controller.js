/*jshint esversion: 6 */
$(function() {

  function ComponentsVC(ajaxUrl, name = "Components", id = "#components") {
    // VIEWs
      // global variables that we are going to use in the different views and functions
      this.name = name;
      this.id = id;
      this.url = ajaxUrl;
      this.userId;
      this.userName;
      

      // Main login form, two submits to introduce the credentails
      ComponentsVC.prototype.loginForm = function() {
        return `
       <label for="username">Username:</label><br>
       <input class="input_form" type="text" id="username" name="username"><br>
       <label for="password">Password:</label><br>
       <input class="input_form" type="password" id="password" name="password"><br><br>
       <input class="submit enviar_info input_form" type="submit" value="Login">
        `
      };


      // main menu with 4 divs to select the different views
      ComponentsVC.prototype.menu = function (){
        return `
        <div s="choose_menu">
          <div class="input_rangeslider">
          <h1 class="name_light">Light</h1>
          <div class="slidecontainer">
            <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
          </div>
          </div>
          <div class="container">
            <div class="box button_light" role="button"><img src="src/light.png"></img></div>
            <div class="box button_water" role="button"><img src="src/water.png"></img></div>
            <div class="box button_electricity" role="button"><img src="src/electricity.png"></img></div>
            <div class="box button_settings" role="button"><img src="src/settings.png"></img></div>
          </div>
        </div>`

      }


      // Menu light where we have 2 checkbox, 1 schedule for the hours and one slider
      ComponentsVC.prototype.menuLightHtml = function(){
        return`
        <div class="container">
          <div>
            <h1>Power<h1>
            <label class="switch">
              <input type="checkbox" id="status_mode_value">
              <span class="slider_toggle round"></span>
            </label>
          </div>
          <div>
            <h1>Automatic<h1>
            <label class="switch">
              <input type="checkbox" id="automatic_mode_value">
              <span class="slider_toggle round"></span>
            </label>
          </div>
        </div>
        <div class="input_rangeslider">
          <h1 class="name_light">Intensity</h1>
          <div class="slidecontainer">
            <input type="range" min="1" max="100" value="50" class="slider" id="myRangeMenuLight">
        </div>
        <div class="center-50">
          <div>
            <h1>Schedule</h1>
            <h2>From</h2>
            <input class="input_time input_time_start" type="time" id="appt_start" name="appt_start" value="10:00">
          </div>
          <div>
            <h2>To</h2>
            <input class="input_time input_time_end" type="time" id="appt_end" name="appt_end" value="13:00">
          </div>
          <br>
          <button class="button-50 save_schedule" type="button" id="save_schedule">Save</button>
        
        </div>
        `
      }

      // Options menu
      ComponentsVC.prototype.MenuSettingsHtml = function(){
        return`
        <div class="row_container">
          <button class="button-50 editProfile" type="button" id="editProfile">Edit</button>
          <button class="button-50 logout" type="button" id="logout" title="logout">Logout</label>
        </div>
        `
      }

      // Water stats
      ComponentsVC.prototype.MenuWaterHtml = function(waterConsumitionToday, waterConsumAverage){
        return `
        <div class="column_container_water">
          <div>
            <h1>Today</h1>
            <div class="data_container">
              <h1>${waterConsumitionToday}</h1>
              <h2>L</h2>
            </div>
          </div>
          <div>
            <h1>Average</h1>
            <div class="data_container">
              <h1>${waterConsumAverage}</h1>
              <h2>L</h2>
            </div>
          </div>
        </div> 
        <div id="chartContainer" style="margin-top: 50px; height: 370px; width: 100%;"></div>   
        `
      }

      // Electricity stats
      ComponentsVC.prototype.MenuElectricityHtml = function(todayConsum, weekConsum, MonthConsum){
        return`
        <div class="column_container">
          <div>
          <h1>Today</h1>
          <div class="data_container">
          <h1>${todayConsum}</h1>
          <h2>kWh</h2>
          </div>
          </div>
          <div>
          <h1>This week</h1>
          <div class="data_container">
          <h1>${weekConsum}</h1>
          <h2>kWh</h2>
          </div>
          </div>
          <div>
          <h1>This month</h1>  
          <div class="data_container">
          <h1>${MonthConsum}</h1>
          <h2>kWh</h2>
          </div>
          </div>    
        </div>
        <div id="chartContainer" style="margin-top: 50px; height: 370px; width:100%;"></div>
        `
      }


      // Edit profile
      ComponentsVC.prototype.editProfile = function() {
        return `
       <h1>Edit user or password of the profile</h1>
       <label for="new_price">Introduce new user</label><br>
       <input class="input_form" type="string" id="new_user" name="new_user"><br>
       <label for="new_price">Introduce new password</label><br>
       <input class="input_form" type="password" id="new_password" name="new_password"><br>
       <input class="edit_user_submit enviar_info input_form" type="submit" value="Update profile">
        `
      };

      // CONTROLLERs
      // Load view editProfile 
      ComponentsVC.prototype.editProfileController = function() {
          $(this.id).html(this.editProfile());
      };

      /*
       This controller submit the new credentials for the user, in case that everything works send a notification in the app.
       If something happens also sends a notification with an error message
      */
      ComponentsVC.prototype.submitEditProfileController = function() {
        let user = $(this.id+' input[name=new_user]').val();
        let password = $(this.id+' input[name=new_password]').val();
        $.ajax({
          dataType: "json",
          method: "PUT",
          url: this.url + '/login/'+this.userId,
          data: {user, password}
        })
        .then(() => {
          this.menuController();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'The data has been modified',
            showConfirmButton: false,
            timer: 1750,
            toast: true
          })
        })
        .catch(error => {
          console.error(error.status, error.responseText);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error ocurred',
            text: 'Something went wrong',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          })
        });
      };

      //Load menuController
      ComponentsVC.prototype.goBackController = function() {
        this.menuController();
      };

      //Load view of the LoginForm
      ComponentsVC.prototype.loginController = function() {
        $(this.id).html(this.loginForm());
      };

      /* 
      Load the view of the settings option.
      Everytime that it moves further to the other views, the goBack button appears.
      Also it change the title of the screen
      */
      ComponentsVC.prototype.menuSettings = function() {

        $('#go_back_button').show();
        document.getElementById('topic').textContent = 'Settings';
        $(this.id).html(this.MenuSettingsHtml());
      };

      /*
      We generate do 3 calls for the API to get the data. 
      Then generate the view with the data got and we call the canvas.js to produce the chart
      */
      ComponentsVC.prototype.menuWater= function() {
        $('#go_back_button').show();
        document.getElementById('topic').textContent = 'Water Control';
        let p1 = $.ajax({
          dataType: "json",
          method: "GET",
          url: this.url+'/waterConsumToday/'+this.userId,
        });
        let p2 = $.ajax({
          dataType: "json",
          method: "GET",
          url: this.url+'/waterConsumAverage/'+this.userId,
        });
        let p3 = $.ajax({
          dataType: "json",
          method: "GET",
          url: this.url+'/waterConsumWeek/'+this.userId,
        });
        Promise.all([p1, p2, p3])
        .then(([r1, r2, r3]) => {
          $(this.id).html(this.MenuWaterHtml(r1.message, r2.message));
          let weekConsumition = r3.message;
          var chart = new CanvasJS.Chart("chartContainer", {
            // This params edit the chart so it make it look as we want
            title:{
              text: "Last week",
              fontColor: "#508BCA",
              fontWeight: "normal",
              fontFamily:"sans-serif",
            },
            axisX: {
              lineColor: "#508BCA",
              labelFontColor: "#508BCA",
              labelFontWeight: "normal",
              labelFontFamily:"sans-serif",
              lineThickness: 0,
              tickThickness: 0,
              gridThickness: 0,
            },
            axisY:{
              gridThickness: 0,
              tickLength: 0,
              lineThickness: 0,
              labelFormatter: function(){
                return " ";
              }
            },
            data: [
            {
              type: "column",
              indexLabelFontColor: "#508BCA",
              dataPoints: [
                { label: weekConsumition[0].date,  y: weekConsumition[0].consumption, indexLabel: "{y}", color: "#508BCA" },
                { label: weekConsumition[1].date, y: weekConsumition[1].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[2].date, y: weekConsumition[2].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[3].date,  y: weekConsumition[3].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[4].date,  y: weekConsumition[4].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[5].date,  y: weekConsumition[5].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[6].date,  y: weekConsumition[6].consumption, indexLabel: "{y}", color: "#508BCA"   }
              ]
            }
            ]
          });
          chart.render();
        })
        .catch(error => {console.error(error.status, error.responseText);
        });

      }

      /*
      Same as before, there are calls for the API. Once the data is obtained
      we generate the view with the data 
      */
      ComponentsVC.prototype.menuElectricity= function() {
    
        $('#go_back_button').show();
        document.getElementById('topic').textContent = 'Electricity Control';
        let p1 = $.ajax({
          dataType: "json",
          method: "GET",
          url: this.url+'/electricityConsumToday/'+this.userId,
        });
        let p2 = $.ajax({
          dataType: "json",
          method: "GET",
          url: this.url+'/electricityConsumWeek/'+this.userId,
        });
        let p3 = $.ajax({
          dataType: "json",
          method: "GET",
          url: this.url+'/electricityConsumMonth/'+this.userId,
        });
        let p4 = $.ajax({
          dataType: "json",
          method: "GET",
          url: this.url+'/ElectricityConsum/'+this.userId,
        });
        Promise.all([p1, p2, p3, p4])
        .then(([r1, r2, r3, r4]) => {
          weekConsumition = r4.message;
          $(this.id).html(this.MenuElectricityHtml(r1.message, r2.message, r3.message));
          var chart = new CanvasJS.Chart("chartContainer", {
            data: [{
              type: "line",
              indexLabelFontSize: 16,
              indexLabelFontColor: "#508BCA",
              dataPoints: [
                { label: weekConsumition[0].date,  y: weekConsumition[0].consumption, indexLabel: "{y}", color: "#508BCA" },
                { label: weekConsumition[1].date, y: weekConsumition[1].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[2].date, y: weekConsumition[2].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[3].date,  y: weekConsumition[3].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[4].date,  y: weekConsumition[4].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[5].date,  y: weekConsumition[5].consumption, indexLabel: "{y}", color: "#508BCA"   },
                { label: weekConsumition[6].date,  y: weekConsumition[6].consumption, indexLabel: "{y}", color: "#508BCA"   }
              ]
            }],
            // Params to edit the look of the chart
            axisX: {
              lineColor: "#508BCA",
              labelFontColor: "#508BCA",
              labelFontWeight: "normal",
              labelFontFamily:"sans-serif",
              lineThickness: 5,
              tickThickness: 0,
              gridThickness: 0,
            },
            axisY: {
              lineColor: "#508BCA",
              labelFontColor: "#508BCA",
              labelFontWeight: "normal",
              labelFontFamily:"sans-serif",
              lineThickness: 5,
              tickThickness: 0,
              gridThickness: 0,
            }
          });
          chart.render();
        })
        .catch(error => {console.error(error.status, error.responseText);
        });
      };


      /*
      First the API get calls are generated. Once the data is one, there are programmed
      the listener waiting for being activate for do the API calls to change the status of the variables
      in the backend. As before, for the different API calls once they are generated, if everything went good
      there is a notification in the app 
      */
      ComponentsVC.prototype.menuLight = function(){

        $('#go_back_button').show();
        document.getElementById('topic').textContent = 'Light Control';
        $(this.id).html(this.menuLightHtml());
        const checkboxAutomatic = document.getElementById("automatic_mode_value");
        const checkboxStatus = document.getElementById("status_mode_value");
        const rangeInput = document.getElementById("myRangeMenuLight");
        const url = this.url;
        const userId = this.userId;
        // Get data of the checkbox
        $.ajax({
          dataType: "json",
          url: url + '/lightControlValue/'+userId,
        })
        .then((r1) => {
          values = r1.message;
          if(values.status == 1) checkboxStatus.click();
          if(values.automatic == 1) checkboxAutomatic.click();
        })
        .catch(error => {
          console.error(error.status, error.responseText);
        })
        rangeInput.addEventListener("input", function() {
          // Calculate the percentage value of the thumb position
          let percentage = parseInt(this.value);
          // Set the gradient background position based on the thumb position
          if(this.value<35 && this.value>20) percentage+=3;
          else if(this.value>65 && this.value<80) percentage-=3;
          else if(this.value>80) percentage-=5;
          else if(this.value<20) percentage+=5;
          console.log(percentage);
          this.style.backgroundSize = `${percentage}% 100%`;
          // Update the power of the light
          $.ajax({
            dataType: "json",
            method: "PUT",
            url: url + '/lightControlPower/'+userId,
            data: {percentage}
          })
          .catch(error => {
            console.error(error.status, error.responseText);
          })
        });
        // Same for the both checkBox, if one of them are triggered they call the API. This case the API call is a GET
        checkboxAutomatic.addEventListener("change", function(event) {
          $.ajax({
            dataType: "json",
            method: "GET",
            url: url + '/lightControlAutomatic/'+userId,
          })
          .then(() => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'The status of the light has been modified',
              showConfirmButton: false,
              timer: 1750,
              toast: true
            })
          })
          .catch(error => {
            console.error(error.status, error.responseText);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error ocurred',
              text: 'Something went wrong',
              showConfirmButton: false,
              timer: 3000,
              toast: true
            })
          });
        });
        checkboxStatus.addEventListener("change", function(event) {
          $.ajax({
            dataType: "json",
            method: "GET",
            url: url + '/lightControlStatus/'+userId,
          })
          .then(() => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'The status of the light has been modified',
              showConfirmButton: false,
              timer: 1750,
              toast: true
            })
          })
          .catch(error => {
            console.error(error.status, error.responseText);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Error ocurred',
              text: 'Something went wrong',
              showConfirmButton: false,
              timer: 3000,
              toast: true
            })
          });
           
        });
      }
      /*
      Menu controller that generate the menu view. As it has the sliderbar, must do the function for when is triggered
      do the api calls 
      */
      ComponentsVC.prototype.menuController = function() {
        $(this.id).html(this.menu());

        $('#go_back_button').hide();
        document.getElementById('topic').textContent = 'Hello, '+this.userName+'!';
        $('#topic').show();
        
        const rangeInput = document.getElementById("myRange");
        const url = this.url;
        const userId = this.userId;
        rangeInput.addEventListener("input", function() {
          // Calculate the percentage value of the thumb position
          let percentage = parseInt(this.value);
          // Set the gradient background position based on the thumb position
          if(this.value<35 && this.value>20) percentage+=3;
          else if(this.value>65 && this.value<80) percentage-=3;
          else if(this.value>80) percentage-=5;
          else if(this.value<20) percentage+=5;
          console.log(percentage);
          this.style.backgroundSize = `${percentage}% 100%`;
          $.ajax({
            dataType: "json",
            method: "PUT",
            url: url + '/lightControlPower/'+userId,
            data: {percentage}
          })
          .catch(error => {
            console.error(error.status, error.responseText);
          })
        });
      };

      // Login submit controller
      ComponentsVC.prototype.submitController = function() {
        let user = $(this.id+' input[name=username]').val();
        let password = $(this.id+' input[name=password]').val();
        $.ajax({
          dataType: "json",
          url: this.url,
          data: {user: user, password: password}
        })
        .then(r => {
          // Add main params and generate the menuView with menuController
          this.userId=r.message.id;
          this.userName=r.message.user;
          $('#title').hide();
          this.menuController();
          Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: 'Loggin correctly',
            showConfirmButton: false,
            timer: 1750,
            toast: true
          })
        })
        .catch(error => {
          console.error(error.status, error.responseText);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'User or password incorrect',
            text: 'If not contact with the administrator',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          })
        }) 
      };

      // Controller for updating the schedule of the Lights. 
      ComponentsVC.prototype.SaveScheController = function() {
        let start_hour = $(this.id+' input[name=appt_start]').val();
        let end_hour = $(this.id+' input[name=appt_end]').val();
        console.log(start_hour, end_hour)
        $.ajax({
          dataType: "json",
          method: "PUT",
          url: this.url+'/lightScheduleModifier/'+this.userId,
          data: {start_hour: start_hour, end_hour: end_hour}
        })
        .then(r => {
          Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: 'Loggin correctly',
            showConfirmButton: false,
            timer: 1750,
            toast: true
          })
        })
        .catch(error => {
          console.error(error.status, error.responseText);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'User or password incorrect',
            text: 'If not contact with the administrator',
            showConfirmButton: false,
            timer: 3000,
            toast: true
          })
        })  
      };
      // Just delete all the fix params that must be used for a new user and prepare everything to have the login view
      ComponentsVC.prototype.logoutController = function() {
        this.userId=null;
        this.userName=null;
        $('#title').show();
        $('#go_back_button').hide();
        $('#topic').hide();
        Swal.fire({
          position: 'bottom-end',
          icon: 'success',
          title: 'Logout correctly',
          showConfirmButton: false,
          timer: 1750,
          toast: true
        }) 
        this.loginController();
      };

      // TRIGGERS
      ComponentsVC.prototype.eventsController = function() {
        $(document).on('click', '.goback', () => this.goBackController());
        $(document).on('click', this.id+' .submit', () => this.submitController());
        $(document).on('click', this.id+' .status_mode', () => this.statusController());
        $(document).on('input', this.id+' .power_mode', () => this.powerController());
        $(document).on('click', this.id+' .automatic_mode', () => this.automaticController());
        $(document).on('click', this.id+' .editProfile', (e) => this.editProfileController());
        $(document).on('click', this.id+' .edit_user_submit', (e) => this.submitEditProfileController());
        $(document).on('click', this.id+' .logout', () => this.logoutController());
        $(document).on('click', this.id+' .profile', () => this.profileController());
        $(document).on('click', this.id+' .button_light', () => this.menuLight());
        $(document).on('click', this.id+' .button_settings', () => this.menuSettings());
        $(document).on('click', this.id+' .button_electricity', () => this.menuElectricity());
        $(document).on('click', this.id+' .button_water', () => this.menuWater());
        $(document).on('click', this.id+' .save_schedule', () => this.SaveScheController());
        
      };
      // Function controller to have a loading screen view
      ComponentsVC.prototype.loadController = function(){
        $('#cuerpo_principal').hide();
        $('#imagen_de_carga').show()
         setTimeout(function(){
        $('#imagen_de_carga').hide();
        $('#cuerpo_principal').show();
         }, 1000);
      }
      // Main functions calls and params define
      this.loadController();
      $('#title').show();
      $('#go_back_button').hide();
      $('#topic').hide();
      this.loginController();
      this.eventsController();     
    }
    
    // Creation of an object View-Controller for the tasks
    let components_vc = new ComponentsVC('http://localhost:8000');
    });

