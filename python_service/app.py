from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    text = data.get('text', '').lower()

    # по приоритетам проходить, ключевые слова в массиве. Можно запилить отдельный файлик
    if any(word in text for word in ['срочно', 'срочная', 'немедленно','побыстрее', 'дедлайн', 'аврал', 'важно', 'до завтра', 'скорее']):
        priority = 'high'
    elif any(word in text for word in ['можно потом', 'попозже', 'позже', 'не срочно', 'когда-нибудь']):
        priority = 'low'
    else:
        priority = 'medium'
    
    # по категориям аналогично
    if any(word in text for word in ['клиент', 'презентация', 'встреча', 'договор', 'переговоры', 'бизнес']):
        category = 'business'
    elif any(word in text for word in ['купить', 'продукты', 'дома', 'погулять', 'убраться', 'позаниматься', 'качалк', 'спорт']):
        category = 'personal'
    elif any(word in text for word in ['баг', 'код', 'frontend', 'backend', 'react', 'expres']):
        category = 'dev'
    else:
        category = 'other'

    return jsonify({
        'priority': priority,
        'category': category
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
