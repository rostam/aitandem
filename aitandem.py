from vosk import Model, KaldiRecognizer
from flask import Flask, request, send_from_directory, render_template
import os, wave, json, base64, datetime, csv
from chatterbot import ChatBot
app = Flask(__name__)

bot = ChatBot('MyChatBot')


def RecognizeVoice(audio_file, language):
    wf = wave.open(audio_file, "rb")
    if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
        print("Audio file must be WAV format mono PCM.")
        exit(1)
    model = Model("/home/rostam/Downloads/model_de")
    rec = KaldiRecognizer(model, wf.getframerate())
    all_res = ""
    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            #            print(rec.Result())
            all_res = all_res + " " + json.loads(rec.Result())['text']
    #            print(all_res)
    #        else:
    #            print(rec.PartialResult())
    res = rec.FinalResult()
    t = json.loads(res)
    all_res = all_res + " " + t['text']
    return all_res


@app.route("/")
def hello():
    return render_template("VoiceService.html")

@app.route("/record", methods=['POST'])
def record():
    language = request.headers.get('lang')
    tag = request.headers.get('tag')
    file_name = 'data/' + str(datetime.datetime.now()).replace(' ', '-') + language + tag + ".wav"
    with open(file_name, 'wb') as f:
        f.write(request.data)
    res = RecognizeVoice(file_name, language)

    return res


if __name__ == "__main__":
    app.run()
