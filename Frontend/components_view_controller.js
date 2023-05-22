/*jshint esversion: 6 */
$(function() {

  function ComponentsVC(ajaxUrl, name = "Components", id = "#components") {
    // VIEWs
      this.name = name;
      this.id = id;
      this.url = ajaxUrl;
      this.userId;
      this.userName;
      this.search = "";
      this.searchProduct = "";
      

      // <span class="nobr"><input type="text" class="search" value="${this.search}" placeholder="Search" onfocus="let v=this.value; this.value=''; this.value=v"> <img class="dsearch" title="Clean Search" src="public/icon_delete.png"/></span>

      ComponentsVC.prototype.loginForm = function() {
        return `
       <label for="username">Nombre de usuario:</label><br>
       <input class="input_form" type="text" id="username" name="username"><br>
       <label for="password">Contraseña:</label><br>
       <input class="input_form" type="password" id="password" name="password"><br><br>
       <input class="submit enviar_info input_form" type="submit" value="Iniciar sesión">
        `
      };

      ComponentsVC.prototype.water_electricity = function(consume, StatusLights) {
        return  `
        <div class="row">
        <div class="dividend_menu">
        <h1>CONSUME</h1>
            <table class="tabla_valores">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Consum</th>
                  <th>Data</th>
                  <th>Hour</th>
                </tr>
              </thead>
              <tbody>
              <tr>
              <tr>`
              +
            consume.reduce(
              (ac, component) => 
              ac += 
              `
                <td>${component.type === 0 ? "Water" : "Electricity"}</td>
                <td>${component.consum} ${component.type === 0 ? "L" : "kWh"}</td>
                <td>${new Date(component.date).toLocaleDateString()}</td>
                <td>${new Date(component.date).getHours()}:${new Date(component.date).getMinutes()}:${new Date(component.date).getSeconds()}</td>
              `, 
              "") +  
              `</tr>
              </tbody>
            </table>
          </div>`
          +
        `<div class="dividend_menu">
        <h1>STATUS LIGHTS</h1>
        <table class="tabla_valores">
              <thead>
                <tr>
                  <th>Power</th>
                  <th>Automatic</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
              <tr>
              <tr>
                <td>${StatusLights.power}</td>
                <td>${StatusLights.automatic === 0 ? "Off" : "On"}</td>
                <td>${StatusLights.status === 0 ? "Off" : "On"}</td>
              </tr>
              </tbody>
        </table>
        <br>
        <table class="tabla_options">
          <tbody>
            <tr>
              <td>
              Power managment
              </td>
              <td>
                <input type="range" min="1" max="100" value="${StatusLights.power}" class="slider power_mode" id="power_mode_value">
              <td>
            </tr>
            <tr>
              <td>
                Automatic mode
              </td>
              <td>
                <div class="button r" id="button-1">
                  <input type="checkbox" class="checkbox automatic_mode" id="automatic_mode_value" ${StatusLights.automatic === 0 ? 'checked': ''}/>
                  <div class="knobs"></div>
                  <div class="layer"></div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                Status mode
              </td>
              <td>
                <div class="button r" id="button-1">
                  <input type="checkbox" class="checkbox status_mode" id="status_mode_value" ${StatusLights.status === 0 ? 'checked': ''}/>
                  <div class="knobs"></div>
                  <div class="layer"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </tr>
        </div>
        </div>`
      };

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
            <div class="box" role="button"><img src="src/electricity.png"></img></div>
            <div class="box button_settings" role="button"><img src="src/settings.png"></img></div>
          </div>
        </div>`

      }

      ComponentsVC.prototype.menuLightHtml = function(){
        return`
        <div class="container">
          <div>
            <h1>Power<h1>
            <label class="switch">
              <input type="checkbox">
              <span class="slider_toggle round"></span>
            </label>
          </div>
          <div>
            <h1>Power<h1>
            <label class="switch">
              <input type="checkbox">
              <span class="slider_toggle round"></span>
            </label>
          </div>
        </div>
        <div class="input_rangeslider">
          <h1 class="name_light">Intensity</h1>
          <div class="slidecontainer">
            <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
        </div>
        <div>
        <h1>Schedule</h1>
        <div>
        <h1>From</h1>
        <input type="time" id="appt" name="appt" min="09:00" max="18:00" required>
        </div>
        <div>
        <h1>To</h1>
        <input type="time" id="appt" name="appt" min="09:00" max="18:00" required>
        </div>
        </div>
        `
      }

      ComponentsVC.prototype.MenuSettingsHtml = function(){
        return`
        <div class="row_container">
          <button class="button-50 editProfile" type="button" id="editProfile">Edit</button>
          <button class="button-50 profile" type="button" id="profile" title="profile">Profile</label>
          <button class="button-50 logout" type="button" id="logout" title="logout">Logout</label>
        </div>
        `
      }


      ComponentsVC.prototype.MenuWaterHtml = function(){
        return`
        <div class="column_container">
          <h1>Today</h1>
          <h1>This week</h1>
          <h1>This month</h1>  
        </div>
        `
      }


    
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

    
      ComponentsVC.prototype.Profile = function() {
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
      ComponentsVC.prototype.editProfileController = function() {
          $(this.id).html(this.editProfile());
      };

      ComponentsVC.prototype.profileController = function() {
          $.ajax({
            dataType: "json",
            url: this.url+'/profile/'+this.userId,
          })
          .then(r => {
            this.userId=r.message;
            $(this.id).html(this.Profile());
          })
          .catch(error => {console.error(error.status, error.responseText);});
      }
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

      ComponentsVC.prototype.statusController = function() {
        $.ajax({
          dataType: "json",
          method: "GET",
          url: this.url + '/lightControlStatus/'+this.userId,
        })
        .then(() => {
          this.menuController();
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
      };

      ComponentsVC.prototype.powerController = function() {
        let power_input = $('#power_mode_value').val();
        $.ajax({
          dataType: "json",
          method: "PUT",
          url: this.url + '/lightControlPower/'+this.userId,
          data: {power_input}
        })
        .then(() => {
          this.menuController();
        })
        .catch(error => { console.error(error.status, error.responseText);}); 
      };

      ComponentsVC.prototype.automaticController = function() {
        $.ajax({
          dataType: "json",
          method: "GET",
          url: this.url + '/lightControlAutomatic/'+this.userId,
        })
        .then(() => {
          this.menuController();
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
      };

      ComponentsVC.prototype.goBackController = function() {
        this.menuController();
      };

      ComponentsVC.prototype.loginController = function() {
        $(this.id).html(this.loginForm());
      };

      ComponentsVC.prototype.menuSettings = function() {
        document.getElementById('topic').textContent = 'Settings';
        $(this.id).html(this.MenuSettingsHtml());
      };

      ComponentsVC.prototype.menuWater = function() {
        document.getElementById('topic').textContent = 'Water Control';
        $(this.id).html(this.MenuWaterHtml());
      };

      ComponentsVC.prototype.menuLight = function(){
        document.getElementById('topic').textContent = 'Light Control';
        $(this.id).html(this.menuLightHtml());
        const rangeInput = document.getElementById("myRange");

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
        });
      }
      ComponentsVC.prototype.menuController = function() {
        /*let p1 = $.ajax({
          dataType: "json",
          url: this.url+'/consumition/'+this.userId,
        });
        let p2 = $.ajax({
          dataType: "json",
          url: this.url+'/lightControl/'+this.userId,
        });
        Promise.all([p1, p2])
        .then(([r1, r2]) => {
          let consume = r1.message;
          let StatusLights = r2.message;
          $(this.id).html(this.menu(consume, StatusLights));
        })
        .catch(error => {console.error(error.status, error.responseText);});*/
        $(this.id).html(this.menu());
        document.getElementById('topic').textContent = 'Hi, '+this.userId+'!';
        $('#topic').show();
        
        const rangeInput = document.getElementById("myRange");

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
        });
      };


      ComponentsVC.prototype.submitController = function() {
        let user = $(this.id+' input[name=username]').val();
        let password = $(this.id+' input[name=password]').val();
        $.ajax({
          dataType: "json",
          url: this.url,
          data: {user: user, password: password}
        })
        .then(r => {
          this.userId=r.message.id;
          this.userName=r.message.user;
          $('#title').hide();
          $('#go_back_button').show();
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

      ComponentsVC.prototype.logoutController = function() {
        this.userId=null;
        $('#logout').hide(); 
        $('#editProfile').hide()
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
        $(document).on('click', this.id+' .button_water', () => this.menuWater());
        
      };
      ComponentsVC.prototype.loadController = function(){
        $('#cuerpo_principal').hide();
        $('#imagen_de_carga').show()
         setTimeout(function(){
        $('#imagen_de_carga').hide();
        $('#cuerpo_principal').show();
         }, 1000);
      }
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

