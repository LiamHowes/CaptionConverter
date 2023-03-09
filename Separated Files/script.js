<script>

let submit_btn = document.getElementById("submit_cc");
var vttFile = null;
let yt_cc = document.getElementById("yt_cc");
var yt_cc_text = "";


submit_btn.addEventListener('click', function(e){
    e.preventDefault();
    yt_cc_text = yt_cc.value;
    let the_form = document.getElementById("caption_form");
    
    const download_anchor = document.getElementById("pseudo_dl");
    download_anchor.href=makeVttFile(yt_cc_text);
    download_anchor.download="webinar-cc.vtt";
    download_anchor.click();
});

makeVttFile = function (text) {
    // perform the necessary regex's on text
    // 1: add "WEBVTT" to the top of file
    text = "WEBVTT\n".concat(text);
    // 2: add proper spacing after each timestamp line
    const reg1 = /\n(\d*:)/g;
    text = text.replaceAll(reg1, "\n\n$1");
    // 3: add milliseconds and arrow after timestamp
    const reg2 = /(:\d\d)(\n)/g;
    text = text.replaceAll(reg2, "$1.000 --> $2");
    // 4: copy and paste the starting timestamp of the next line to the end of the previous timestamp's arrow ("-->")
    //  4.1 split text based on double line break ("\n\n")
    let textArray = text.split("\n\n");
    //  4.2 for each index, get the NEXT timestamp and paste it afer the arrow of the current timestamp
    for(let i=1; i<textArray.length; i++){ // skip first array index because that will be the string "WEBVTT" because of step 1
        if(i == textArray.length-1){ // use length of video to add last timestamp
            let video_length = document.getElementById("final_timestamp").value;
            video_length = video_length.concat(".000"); // add milliseconds
            textArray[i] = "\n\n".concat(textArray[i].split(" -->")[0].concat(" --> ").concat(video_length).concat(textArray[i].split(" -->")[1]));
        }
        else{
            let next_timestamp = textArray[i+1].split(" -->")[0];
            textArray[i] = "\n\n".concat(textArray[i].split(" -->")[0].concat(" --> ").concat(next_timestamp).concat(textArray[i].split(" -->")[1]));
        }
    } 
    //  4.3 rejoin the string array back together in the "text" variable
    text = textArray.join("");

    var data = new Blob([text], {type: 'text/vtt'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (vttFile !== null) {
        window.URL.revokeObjectURL(vttFile);
    }

    vttFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    return vttFile;
};

</script>
