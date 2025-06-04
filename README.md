# A to B

In this game, you are given a starting point A on one side of the grid, and an ending point B on the other side of the grid. Your objective is to get from point A to point B.  Each grid space is considered "Blank”, “Speeder”, “Lava”, or “Mud”, and has corresponding consequences. You start out with 200 points of health and 450 moves. 

Watch your health.

## Overview

This game is built using vanilla HTML & CSS to construct the layout and UI, and StimulusJS to power the game mechanics.

## Requirements

The only requirement to run this game locally is to start a basic local web server from the root directory. We need a local web server to satisfy CORS requirements of modern browsers, so that we can serve local assets. In the example below we are using Python 3, but any local web server should do.

## Running the game

1. Clone this repository
2. Navigate to the directory where you cloned the repository
3. Run the following command from the root directory:
```bash
python3 -m http.server 8000
```
4. Open your browser and navigate to `http://localhost:8000`
