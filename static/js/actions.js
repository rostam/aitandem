function ChangeLang() {
  $('#RandomText').html(sample_sentences[$('#SelectLang').val()][0]);
}

function AddSampleSentence() {
   var SampleSentence = prompt("Please enter a sample sentence in your prefered language:", "");
   console.log(SampleSentence);;
}

function QuestionButton() {
    let data = new FormData();
    data.append("text", $('#QuestionText').val());
    data.append("lang", $('#SelectLang').val());

    $.post('question',
        { text: $('#QuestionText').val(), lang: $('#SelectLang').val() },
        function(data, status, xhr) {
            title_subitle = data.split(':')
            arr = title_subitle[0].split("---")
            arr1 = arr[0].split(",")
            arr2 = arr[1].split(",")
            $('#recordingsList').append("<hr><li>" + $('#QuestionText').val() + "</li>")
            for(var i=0;i<3;i++) {
              $('#recordingsList').append("<li>"  + arr1[i] +  ", " + arr2[i] + "</li>");
            }

            arr = title_subitle[1].split("---")
            arr1 = arr[0].split(",")
            arr2 = arr[1].split(",")
            $('#recordingsList').append("<br>")
            for(var i=0;i<3;i++) {
              $('#recordingsList').append("<li>"  + arr1[i] +  ", " + arr2[i] + "</li>");
            }

//            $('p').append('status: ' + status + ', data: ' + data);
          })
//          .done(function() { console.log('Request done!'); })
//        .fail(function(jqxhr, settings, ex) { alert('failed, ' + ex); });
}
