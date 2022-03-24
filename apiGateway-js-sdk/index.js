
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition

function voiceSearch(){
    if ('SpeechRecognition' in window) {
        console.log("SpeechRecognition is Working");
    } else {
        console.log("SpeechRecognition is Not Working");
    }
    
    var searchQuery = document.getElementById("search_query");
    const recognition = new SpeechRecognition();

    micButton = document.getElementById("mic_search");  
    
    if (micButton.innerHTML == "mic") {
        recognition.start();
    } else if (micButton.innerHTML == "mic_off"){
        recognition.stop();
    }

    recognition.addEventListener("start", function() {
        micButton.innerHTML = "mic_off";
        console.log("Recording.....");
    });

    recognition.addEventListener("end", function() {
        console.log("Stopping recording.");
        micButton.innerHTML = "mic";
    });

    recognition.addEventListener("result", resultOfSpeechRecognition);
    function resultOfSpeechRecognition(event) {
        const current = event.resultIndex;
        transcript = event.results[current][0].transcript;
        searchQuery.value = transcript;
        console.log("transcript : ", transcript)
    }
}

function textSearch() {
    var searchText = document.getElementById('search_query');
    if (!searchText.value) {
        alert('Please enter a valid text or voice input!');
    } else {
        searchText = searchText.value.trim().toLowerCase();
        console.log('Searching Photos....');
        searchPhotos(searchText);
    }
    
}

function searchPhotos(searchText) {

    console.log(searchText);
    document.getElementById('search_query').value = searchText;
    document.getElementById('photos_search_results').innerHTML = "<h4 style=\"text-align:center\">";

    var params = {
        'q' : searchText
    };
    
    apigClient.searchGet(params, {}, {})
        .then(function(result) {
            console.log("Result : ", result);

            image_paths = result["data"];
            console.log("image_paths : ", image_paths);

            var photosDiv = document.getElementById("photos_search_results");
            photosDiv.innerHTML = "";

            var n;
            for (n = 0; n < image_paths.length; n++) {
                imageName = image_paths[n]['key'];
                console.log("name ",imageName);

                photosDiv.innerHTML += '<figure><img src="https://b2bucketphotos.s3.amazonaws.com/' + imageName + '" style="width:25%"><figcaption>' + imageName + '</figcaption></figure>';
            }

        }).catch(function(result) {
            console.log(result);
        });
}

function uploadPhoto() {
    var filePath = (document.getElementById('uploaded_file').value).split("\\");
    console.log("hello!");
    console.log("dd: ", document.getElementById('uploaded_file'));
    console.log('FilePath : ', filePath);
    var fileName = filePath[filePath.length - 1];
    
    if (!document.getElementById('custom_labels').innerText == "") {
        var customLabels = document.getElementById('custom_labels');
    }
    console.log(fileName);
    console.log(custom_labels.value);

    var reader = new FileReader();
    var file = document.getElementById('uploaded_file').files[0];
    console.log('File : ', file);
    document.getElementById('uploaded_file').value = "";

    if ((fileName == "") || (!['png', 'jpg', 'jpeg'].includes(fileName.split(".")[1]))) {
        alert("Please upload a valid .png/.jpg/.jpeg file!");
    } else {

        var params = {'key': fileName, 'bucket': 'b2bucketphotos', 'Content-Type': file.type, 'x-amz-meta-customLabels': custom_labels.value, 'Accept': '*/*'};
        var additionalParams = {
            // headers: {
            //     'Access-Control-Allow-Origin': '*'
            // }
        };

        var xhr = new XMLHttpRequest(); 
        console.log(custom_labels.value);
        xhr.open("PUT", "https://8j3mh40b77.execute-api.us-east-1.amazonaws.com/photoAlbum/upload/b2bucketphotos/"+fileName+"?x-amz-meta-customLabels="+custom_labels.value);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("x-api-key", "z0K9JFfvuf2qKOfHDvmnE9L7QFTb4BxHJ6wDgvmh");
        xhr.send(file);
    }
}