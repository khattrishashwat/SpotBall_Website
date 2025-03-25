$(document).ready(function(){
    $(window).scroll(function(){
        $val = $(window).scrollTop();
        if($val > 150){
           $('header').addClass("headerfixed")
        }else{
          $('header').removeClass("headerfixed")
        }
    })
})


$(document).ready(function(){
  $(".showsigninpopup_onclick").click(function(){
    $("#signin_popup_main_new").show();
    $(".menulist_divmanin").hide();
  });
  $(".signincrossbtnnew").click(function(){
    $("#signin_popup_main_new").hide();
  });
  $(".signincrossbtnnew").click(function(){
    $("#signin_popup_main_new").hide();
  });

  $(".singupcrossbtn").click(function(){
    $("#signup_popup_main").hide();
  });

  $(".showsignupbtn_main").click(function(){
    $("#signin_popup_main_new").hide();
    $("#signup_popup_main").show();
  });

  $(".showsigninbtn_div").click(function(){
    $("#signup_popup_main").hide();
    $("#signin_popup_main_new").show();
  });

  $(".forgotpass_popup_crossbtn").click(function(){
    $("#forgotpass_mainnew_popup").hide();
  });

  $(".forgotpas_btn_signin").click(function(){
    $("#signin_popup_main_new").hide();
    $("#forgotpass_mainnew_popup").show();
  });


  $(".sbmtbtn_showotpscreen").click(function(){
    $("#forgotpass_mainnew_popup").hide();
    $("#otpverificationpopup_new").show();
  });
 

  $(".otpverificationcrossbtn").click(function(){
    $("#otpverificationpopup_new").hide();
  });

  $(".otpverify_sbmtbtn").click(function(){
    $("#otpverificationpopup_new").hide();
    $("#createnewpass_divnew").show();
  });

  $(".crreatenewpass_crosicon").click(function(){
    $("#createnewpass_divnew").hide();
  });

  $(".showmenus_clickbtn").click(function(){
    $(".menulist_divmanin").toggle();
  });


  // $(".notificationclick").click(function(){
  //   $(".notificationdiv_popup").show();
  // });

  // $(".crossbtn_notification img").click(function(){
  //   $(".notificationdiv_popup").hide();
  // });
  
  
  $("#showregis_form_click").click(function(){
    $("#signup_popup_main").show();
  });
  $("#footerregisbtn").click(function(){
    $("#signup_popup_main").show();
  });

  $("#howtoplay_showonclick").click(function(){
    $("#howtoplaypopup_new").show();
  });

  $("#crossbtn_popuphowtoplay").click(function(){
    $("#howtoplaypopup_new").hide();
  });

  $(".footer_howtoplayfaqlink").click(function(){
    $("#howtoplaypopup_new").show();
  });
  
  $(".showpaydonepopup_click").click(function(){
    $(".paymentmainpopup_showonclickpay").show();
  });
  
  
});

$(document).ready(function() {
  $('.notificationclick').on('click', function(e) {
      $('#notificationPopup').toggle();
      e.stopPropagation(); 
  });
  $('#closeNotificationPopup').on('click', function(e) {
      $('#notificationPopup').hide();
      e.stopPropagation(); 
  });
  $('#notificationPopup').on('click', function() {
      $(this).hide();
  });
  $('#popupContent').on('click', function(e) {
      e.stopPropagation(); 
  });
});

function paymentdonepopupCrossbtn() {
  location = "index_2.html";   
}


function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector(".days");
  var hoursSpan = clock.querySelector(".hours");
  var minutesSpan = clock.querySelector(".minutes");
  var secondsSpan = clock.querySelector(".seconds");

  function updateClock() {
    var t = getTimeRemaining(endtime);

    if (t.total <= 0) {
      clearInterval(timeinterval);

      var newTime = Date.parse(endtime);
      var nowTime = Date.parse(new Date());

      while (newTime <= nowTime) {
        newTime = newTime + 1 * 24 * 60 * 60 * 1000; // add 24hours
      }

      var deadline = new Date(newTime);
      initializeClock('countdown', deadline);
    } else {
      daysSpan.innerHTML = t.days;
      hoursSpan.innerHTML = ("0" + t.hours).slice(-2);
      minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
      secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

var deadline = "December 7 2024 00:00:00 GMT+0200";
initializeClock("countdown", deadline);






var loadFile = function (event) {
  var image = document.getElementById("output_updatepro");
  image.src = URL.createObjectURL(event.target.files[0]);
};



var otp_inputs = document.querySelectorAll(".otp__digit")
var mykey = "0123456789".split("")
otp_inputs.forEach((_)=>{
  _.addEventListener("keyup", handle_next_input)
})
function handle_next_input(event){
  let current = event.target
  let index = parseInt(current.classList[1].split("__")[2])
  current.value = event.key
  
  if(event.keyCode == 8 && index > 1){
    current.previousElementSibling.focus()
  }
  if(index < 6 && mykey.indexOf(""+event.key+"") != -1){
    var next = current.nextElementSibling;
    next.focus()
  }
  var _finalKey = ""
  for(let {value} of otp_inputs){
      _finalKey += value
  }
  if(_finalKey.length == 6){
    document.querySelector("#_otp").classList.replace("_notok", "_ok")
    document.querySelector("#_otp").innerText = _finalKey
  }else{
    document.querySelector("#_otp").classList.replace("_ok", "_notok")
    document.querySelector("#_otp").innerText = _finalKey
  }
}




document.addEventListener('DOMContentLoaded', () => {
  var toDayFromNow = (new Date("Sep 31, 2024 23:59:59").getTime() / 1000) + (3600 / 60 / 60 / 24) - 1;
  var flipdown = new FlipDown(toDayFromNow)
  .start()
  .ifEnded(() => {
      document.querySelector(".flipdown").innerHTML = `<h2>Timer is ended</h2>`;
  });
});


// ------------ price range slider js -------------
//-----JS for Price Range slider-----

$(function () {
  $("#slider-range").slider({
    range: true,
    min: 100,
    max: 500,
    values: [100, 500],
    slide: function (event, ui) {
      $("#amount").val(ui.values[0] + " - " + ui.values[1]);
    }
  });
  $("#amount").val(
     +
      $("#slider-range").slider("values", 0) +
      " - " +
      $("#slider-range").slider("values", 1)
  );
});


var favicon_click = $(".iconforfav");
		favicon_click.click(function () {
			if (favicon_click.is(".fa-heart-o")) {
				$(this).removeClass("fa-heart-o");
				$(this).addClass("fa-heart");
			} else {
				$(this).removeClass("fa-heart");
				$(this).addClass("fa-heart-o");
			}
			return false;
		});


    function chechpassFunction() {
      var x = document.getElementById("createpass_inp");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }

    function chechpassFunction_signup() {
      var x = document.getElementById("createpass_inp_signup");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }

    function chechpassFunction_signup2() {
      var x = document.getElementById("createpass_inp_signup2");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }
    

    function chechpassFunction_createnew1() {
      var x = document.getElementById("createpass_inp_new1");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }
    
    function chechpassFunction_createnew2() {
      var x = document.getElementById("createpass_inp_new2");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }

    function chechpassFunction_signup_forgot() {
      var x = document.getElementById("createnewpass_forgot");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }

    function chechpassFunction_signup_forgot2() {
      var x = document.getElementById("createnewpass_forgot2");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }
    

    const video = document.getElementById("video_howtoplay");
const circlePlayButton = document.getElementById("circle-play-b");

function togglePlay() {
	if (video.paused || video.ended) {
		video.play();
	} else {
		video.pause();
	}
}

circlePlayButton.addEventListener("click", togglePlay);
video.addEventListener("playing", function () {
	circlePlayButton.style.opacity = 0;
});
video.addEventListener("pause", function () {
	circlePlayButton.style.opacity = 1;
});


// $(document).ready(function(){
//   $(".compitionslinkclick").click(function(){
//     $(".compitionsection").addClass("scrollcompitions_onclick");
//   });
// });

$(document).ready(function(){
  $(".clickforgotsubmitbtn").click(function(){
    $("#forgotpass_modalpopup").hide();
  });
  $("#show").click(function(){
    $("p").show();
  });
});


