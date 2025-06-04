import { Application } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js"
import GameController from "./controllers/game_controller.js"

window.Stimulus = Application.start()

Stimulus.register("game", GameController) 
