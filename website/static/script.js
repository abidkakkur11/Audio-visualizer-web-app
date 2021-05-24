	
window.onload = function() {

	var music = document.getElementById("music");
	var audio = document.getElementById("audio");
	


	var canvasBackground = document.getElementById("canvasBackground");
	var bContext = canvasBackground.getContext("2d");
	canvasBackground.width = window.innerWidth;
	canvasBackground.height	= window.innerHeight;
	var canvasBackgroundWidth = canvasBackground.width;
	var canvasBackgroundHeight = canvasBackground.height;

	var canvas = document.getElementById("canvas");
	var cContext = canvas.getContext("2d");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;

	var gradient = bContext.createRadialGradient(0.5 * canvasBackgroundWidth, 0.95 * canvasBackgroundHeight, 100, 
		0.5 * canvasBackgroundWidth, 0.95 * canvasBackgroundHeight, 900);
	gradient.addColorStop(0,"#001f33");
	gradient.addColorStop(1,"#000a1a");
	bContext.fillStyle = gradient;
	bContext.fillRect(0, 0, canvasWidth, canvasHeight);

	var line = true;
	var bars = false;
	var dots = false;

	document.getElementById("line").onclick = function() {
		line = true;
		bars = false;
		dots = false;
	}

	document.getElementById("bars").onclick = function() {
		line = false;
		bars = true;
		dots = false;
	}

	document.getElementById("dots").onclick = function() {
		line = false;
		bars = false;
		dots = true;
	}

	music.onchange = function() {
		var files = this.files;
		audio.src = URL.createObjectURL(files[0]);
		audio.loop = true;
		audio.load();
		audio.play();
		


		var context = new AudioContext();
		var src = context.createMediaElementSource(audio);
		var analyzer = context.createAnalyser();

		src.connect(analyzer);
		analyzer.connect(context.destination);
		analyzer.smoothingTimeConstant = 0.85;

		analyzer.fftSize = 512;
		var bufferLength = analyzer.frequencyBinCount;

		var dataArray = new Uint8Array(bufferLength); 

		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;

		var barWidth = (canvasWidth / bufferLength) * 2;
		var barHeight;
		var x;

		function renderFrame() {
			requestAnimationFrame(renderFrame);

			x = 0;

			analyzer.getByteFrequencyData(dataArray);

			cContext.clearRect(0, 0, canvasWidth, canvasHeight);
			
			if (line) {
				cContext.beginPath();
				cContext.moveTo(-20, canvasHeight - (2.5 * dataArray[0] + 50));

				for (var i = 1; i < bufferLength; i++) {
			        barHeight = dataArray[i];
  
					cContext.lineTo(x, canvasHeight - (2.5 * barHeight + 50));

			        x += 1.2 * barWidth;
			    }

			    cContext.strokeStyle = "#eeeeee";
				cContext.lineWidth = 2;
				cContext.shadowColor = "#eeeeee";
				cContext.shadowBlur = 10;
				cContext.stroke();

			} else if (bars) {

				for (var i = 0; i < bufferLength; i++) {
			        barHeight = (dataArray[i]);


			        var r = 0.8 * barHeight + 25 * (i/bufferLength);
			        var g = 300 * (i/bufferLength);
			        var b = 100	;

			        cContext.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			        cContext.fillRect(x - 23.2, canvasHeight - 2.5 * barHeight, 2 * barWidth, 2.5 * barHeight);
			        cContext.shadowColor = "#000000";
					cContext.shadowBlur = 0;

			        x += 2 * barWidth + 3.3;
		    	}
		    	
			} else if (dots) {

				for (var i = 0; i < bufferLength; i++) {
			        barHeight = (dataArray[i]);

			        cContext.fillStyle = "white";
			        cContext.fillRect(x - 25, canvasHeight - 3 * barHeight, barWidth, 3);
			        cContext.shadowColor = "#eeeeee";
					cContext.shadowBlur = 2;

			        x += barWidth + 2.2;
			    }

			}

		}	

		renderFrame();

	}

}