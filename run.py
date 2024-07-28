from flask import Flask, render_template, request, jsonify
import review

app = Flask(__name__)

@app.route('/')
def index():
    # my_list = ['a','b','c','d']
    # days = 30
    return render_template('index.html')

@app.route('/get_start', methods=['POST'])
def get_start():
    data = request.get_json()
    file_name = data.get('file_name', 'reocrd-Karis.xlsx')
    learn_words = data.get('learn_words', 5)
    my_list, days = review.review(file_name, learn_words)
    return jsonify(my_list=my_list, days=days)

@app.route('/get_review', methods=['POST'])
def get_review():
    data = request.get_json()
    file_name = data.get('file_name', 'reocrd-Karis.xlsx')
    res, days = review.get_review(file_name)
    return jsonify(res=res, days=days)

if __name__ == '__main__':
    app.run(debug=True, port=80, threaded=True, host='0.0.0.0')
    
