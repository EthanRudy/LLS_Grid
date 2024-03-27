# Lake Litter Solutions (LLS)

## What is LLS?
    Our goal is to create an accessible, relatively affordable lake cleaning solution.
    The current prototype skims the surface of the water, collecting trash before it can sink, before
    it can further pollute our water ways.
    
## How does it work?
Currently, the bot is controlled through the code in this repo. 
<br><br>
Step 1. We use the Google Maps API to enable the user to select the geofence (Macro boundary).
<br><br>
Step 2. We take this data and with help of the Google *Static* Maps API and p5js to let the user select the specific areas they would like cleaned. The macro boundary is subdivided to 5x5 meter micro boundaries. The user can select what micro boundaries inside the macro boundary they would like to enable, a starting point, and an ending point.
<br><br>
![Macro and Micro Boundary Image](/images/macro_and_micro.png)
<br><br>
Step 3. After the enabled micro boundaries/cells are selected, we run a lightweight pathfinding algorithm to compute the path the robot will take whilst cleaning the body of water.
<br><br>
![Pathfinding Visualization](/images/pathfinding.png)
<br><br>
Step 4. The User places the robot in the water at the starting point, goes on a lunch break, and returns to retrieve the robot at its ending point.

## How do I get the site up and running?
### Requirements:
 - An internet connection
 - Node.js &  npm
### Commands
    > npm i
    > npm start
After running these commands, you will be prompted with a **http://localhost:XXXX/** link. Control/Command click this to open it in your OS default browser.