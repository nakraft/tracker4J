import pandas as pd 
import plotly
import plotly.express as px
import plotly.graph_objects as go
import json

def build_dashboard(profile, app): 

    print("here")
    print(profile)
    print(app)

    df = pd.DataFrame({
        "Fruit": ["Apples", "Oranges", "Bananas", "Apples", "Oranges", "Bananas"],
        "Amount": [4, 1, 2, 2, 4, 5],
        "City": ["SF", "SF", "SF", "Montreal", "Montreal", "Montreal"]
    })
    fig = px.bar(df, x="Fruit", y="Amount", color="City", barmode="group")
    # layout = go.Layout(
    #     paper_bgcolor='#555',
    #     plot_bgcolor='#555', 
    #     font_color= 'white', 
    #     margin=dict(l=50,r=30,b=30,t=50),
    # )
    # fig = go.Figure(layout=layout)


    # fig.add_trace(
    #             go.Bar(
    #                 x = [10, 20, 30, 40 , 50],
    #                 y = [100, 200, 300, 400, 500], 
    #                 name = 'Testing Graph'
    #              )
    #         )

    # fig.update_layout(
    #     barmode="stack", xaxis_title="Year", yaxis_title="Total Expenditures"
    # )

    # return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    return plotly.io.to_json(fig, pretty=True)