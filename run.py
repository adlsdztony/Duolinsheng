from flask import Flask, render_template, request, jsonify
import review

app = Flask(__name__)

@app.route('/')
def index():
    # my_list = ['a','b','c','d']
    # days = 30
    return render_template('index.html')

@app.route('/get_review', methods=['POST'])
def get_review():
    my_list, days = review.review('record.xlsx')
    return jsonify(my_list=my_list, days=days)

if __name__ == '__main__':
    app.run(debug=True)
    # , port=80, threaded=True, host='0.0.0.0'