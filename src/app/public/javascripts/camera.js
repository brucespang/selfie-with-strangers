//use http://davidwalsh.name/browser-camera as reference

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
  // Grab elements, create settings, etc.
  var video = document.getElementById("video"),
  videoObj = { "video": true },
  errBack = function(error) {
    console.log("Video capture error: ", error.code); 
  };

  // Put video listeners into place
  if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia(videoObj, function(stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } 
  else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(videoObj, function(stream){
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
  else if(navigator.mozGetUserMedia) { // Firefox-prefixed
    navigator.mozGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
  // Trigger photo take
  document.getElementById("snap").addEventListener("click", function() {
    var canvas = document.createElement('canvas');
    canvas.width  = 320;
    canvas.height = 240;
    var context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, 320, 240);
    canvas.addEventListener('click', function(){
      $("canvas").removeClass("selected");
      canvas.className = "selected";
    });
    document.getElementById("pictures").appendChild(canvas);
  });

  /*
    how to get form to check for "input":
    http://stackoverflow.com/questions/17865148/using-jquery-to-prevent-form-submission-when-input-fields-are-empty
    
    maybe how to send pictures?
    http://stackoverflow.com/questions/8726400/how-can-i-add-an-image-file-into-json-object
    http://stackoverflow.com/questions/21926893/sending-an-image-and-json-data-to-server-using-ajax-post-request
  */
  document.getElementById("done").addEventListener("click", function() {
    var numItems = $('.selected').length;
    if($("canvas").length === 0){
      $("#message").text("Please take a picture");
    }
    else if(numItems != 1){
      $("#message").text("Please pick a picture");
    }
    else{
      $("#message").text("Picture is sent");    //will actually send the pic
      
    }
  });
}, false);
