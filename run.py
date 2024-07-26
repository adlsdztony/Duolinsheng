from flask import Flask, render_template
import review

app = Flask(__name__)

@app.route('/')
def index():
    my_list, days = review.review('record.xlsx')
    # my_list = ['a','b','c','d']
    return render_template('index.html', my_list=my_list, days=days)

if __name__ == '__main__':
    app.run(debug=True, port=80, threaded=True, host='0.0.0.0')