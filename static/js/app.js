URL = window.URL || window.webkitURL;
var gumStream;
var rec;
var input;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");

function startRecording() {
    console.log("salam");
    var constraints = { audio: true, video:false }
	recordButton.disabled = true;
	stopButton.disabled = false;
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
		audioContext = new AudioContext();
		document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"
		gumStream = stream;
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input,{numChannels:1})
		rec.record()
	}).catch(function(err) {
    	  recordButton.disabled = false;
    	  stopButton.disabled = true;
	});
}

function stopRecording() {
    stopButton.disabled = true;
    recordButton.disabled = false;
    rec.stop();
    gumStream.getAudioTracks()[0].stop();
    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');
	var filename = new Date().toISOString();
	au.controls = true;
	au.src = url;
	link.href = url;
	//link.download = filename+".wav";
	link.innerHTML = "Save to disk";
	li.appendChild(au);
	li.appendChild(document.createTextNode(filename+".wav "))
	li.appendChild(link);
	$('#loader').show();
	var xhr=new XMLHttpRequest();
	xhr.onload=function(e) {
		if(this.readyState === 4) {
		     li.appendChild(document.createElement("BR"));
		     tmp = document.createElement("H3");
		     tmp.appendChild(document.createTextNode(e.target.responseText));
		     li.appendChild(tmp);
		     li.appendChild(document.createElement("BR"));
		     $('#loader').hide()

             utter = new SpeechSynthesisUtterance();
             utter.lang = 'de-DE';
             utter.volume = 0.5;
             utter.onend = function() { alert('Speech has finished');}
		     utter.text = e.target.responseText;
		     window.speechSynthesis.speak(utter);
	     }
        };
	xhr.open("POST","record",true);
	xhr.setRequestHeader('lang', $('#SelectLang').val());
	xhr.setRequestHeader('tag',  $('#tag').val());
	xhr.send(blob);
	li.appendChild(document.createTextNode (" "));
	recordingsList.appendChild(li);
}
