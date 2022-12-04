import pandas as pd 
import plotly
import plotly.express as px
import plotly.graph_objects as go
import json

def build_dashboard(app, career): 

    df = pd.DataFrame(app)
    groupings = df.groupby('status')['_id'].count().reset_index().rename(columns={'status': 'Job Status', '_id' : 'count'})
    groupings = groupings.append({'Job Status' : 'Career Fairs', 'count': len(pd.DataFrame(career))}, ignore_index=True)
    print(groupings)

    fig = px.bar(groupings, x="Job Status", y="count", barmode="group", width=800)
    # fig.update_layout(paper_bgcolor = "lightgray")

    return plotly.io.to_json(fig, pretty=True)

def build_indicators(applications, careers, email): 

    print("EHRELRKEJL")
    df = pd.DataFrame(applications)
    print(df.columns)
    numMe = len(df[df['email'] == email])
    numTotal = len(df)
    print(numMe, numTotal, 'application counts')

    dff = pd.DataFrame(careers)
    numCareerMe = len(dff[dff['email'] == email])
    numCareerTotal = len(dff)

    fig = go.Figure()

    fig.add_trace(go.Indicator(
        mode = "number+delta",
        value = numMe,
        domain = {'x': [0, 0.5], 'y': [0, 1]},
        title = {"text": "Application Tracker"},
        delta = {'reference': numTotal, 'relative': True, 'position' : "top"}))

    fig.add_trace(go.Indicator(
        mode = "number+delta",
        value = numCareerMe,
        delta = {'reference': numCareerTotal, 'relative': True},
        title = {"text": "Career Fair Tracker"},
        domain = {'x': [.6, 1], 'y': [0, 1]}))

    fig.update_layout(paper_bgcolor = "lightgray", width = 800, height = 300)

    return plotly.io.to_json(fig, pretty=True)

