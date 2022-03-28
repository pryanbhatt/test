// set up basic variables for app

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
var audioLists = [];
var formData1 = null;

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function(e) {
        e.preventDefault();
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function(e) {
        e.preventDefault();
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
        e.preventDefault();
      console.log("data available after MediaRecorder.stop() called.");

      const clipName = prompt('Enter a name for your sound clip?','My unnamed clip'+Date.now());

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      audio.controls = true;
      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
//      const reader = new FileReader();
        
        audioLists.push({value: blob, fileName: clipName});
        
        
//      reader.readAsDataURL(blob);
//        
//        reader.onload = () => {
//            
//            var base64AudioMessage = reader.result.split(',')[1];
//            var audioNote = base64AudioMessage;
//            
////            formData1.append('audioFiles', JSON.stringify(audioNote), clipName);
//            
//            audioLists.push({value: JSON.stringify(audioNote) }, {filename: clipName});
//            console.log(audioLists);
//            
//            base64AudioMessage = null;
//            audioNote = null;
//        }
//        
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
        
        
        
        
        
        
        
        
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
          e.preventDefault();
        let evtTgt = e.target;
//          console.log(evtTgt.parentNode);
//          console.log(evtTgt.parentNode.getElementsByTagName('p')[0].innerHTML);
          let toDelete = evtTgt.parentNode.getElementsByTagName('p')[0].innerHTML;
          
          const removeIndex = audioLists.findIndex( item => item.fileName === toDelete );
          audioLists.splice( removeIndex, 1 );
          
          
          console.log(audioLists);
          
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

function visualize(stream) {
  if(!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw()

  function draw() {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    let sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;


    for(let i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();

  }
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();

$(document).ready(function () {

    $("#submit-button").click(function (e) {
        
        e.preventDefault();
        
        var form = $('#multi-form')[0];
        
        var formData = new FormData(form);
        
//        formData.append('audioFiles', audioLists);
        
       $.each(audioLists, function( k, v ) {
//            console.log( k + ':' + value );
           formData.append('audioFiles', v['value'], v['fileName']);
       });
        
        var id = uid();
        
        formData.append('id', id);
//        
        
        
//        console.log(formData.get('note')); 
//        console.log(formData.getAll('docs'));
        var res = Array.from(formData.entries(), ([key, prop]) => (
            {[key]: {
              "ContentLength": 
              typeof prop === "string" 
              ? prop.length 
              : prop.size
            }
          }));

//        console.log(res);
        

//        console.log(formData.getAll('audioFiles'));
        
        $("#submit-button").prop("disabled", true);
        
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/dashboard/posts",
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                
                
                
               

                $("#status").text(data.message);
                console.log("SUCCESS : ", data.success);
                $("#submit-button").prop("disabled", false);

            },
            error: function (err) {
                
//                let obj = JSON.parse(data);

                $("#status").text('Oh no .. An Error occured while posting');
                console.log("ERR : ", 'Oh no .. An Error occured while posting');
                $("#submit-button").prop("disabled", false);

            }
        });
        
        
        
    });

});


//generates random id;
let uid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}