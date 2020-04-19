import "./Background.less";

import _ from "lodash";
import React, {Component} from "react";

import starPng from "./star.png";
import StarsBackground from "./StarsBackground";

export default class Background extends Component {
  constructor(props) {
    super(props);
    this.starImg = new Image();
    this.starImg.src = starPng;
    this.updateDimensions = this.updateDimensions.bind(this);
    this.animate = this.animate.bind(this);
    this.points = [];
  }

  updatePoints(points) {
    this.points = points;
    if (!this.pendingAnimationFrame) {
      this.pendingAnimationFrame = window.requestAnimationFrame(this.animate);
    }
  }

  onDragStart(e) {
    console.log("drag start");
    const img = this.starImg;
    e.dataTransfer.setDragImage(img, img.width / 2, img.height / 2);
  }

  onDragEnd(e) {
    console.log("drag end");
    this.updatePoints([]);
  }

  onDrag(e) {
    if (e.clientX === 0 && e.clientY === 0) {
      // Phantom drag at 0,0 before drag end, ignore it.
      this.updatePoints([]);
      return;
    }
    this.updatePoints([ {
      x : e.clientX,
      y : e.clientY,
      color : "#12a",
    } ]);
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.updateDimensions();
  }

  updateDimensions() {
    if (!this.canvas) {
      return;
    }
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  animate() {
    if (!this.canvas) {
      return;
    }
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    if (this.points && this.points.length > 0) {
      if (!this.pendingAnimationFrame) {
        this.pendingAnimationFrame = window.requestAnimationFrame(this.animate);
      }
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      delete this.pendingAnimationFrame;
      return;
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    const img = this.starImg;
    for (let i = 0; i < this.points.length; i++) {
      const {x, y, color} = this.points[i];
      ctx.drawImage(img, x - img.width / 2, y - img.height / 2);
    }
    delete this.pendingAnimationFrame;
  }

  render() {
    return (
      <div className="background-container">
        <StarsBackground />
        <div
    className = "magic-button"
    draggable = "true"
    onDragStart = {this.onDragStart.bind(
        this)} onDragEnd = {this.onDragEnd.bind(this)} onDrag =
        {this.onDrag.bind(this)} >
          ✨ <
            /div>
        <canvas className="drawing-board" ref={this.setCanvas.bind(this)} /><
        /div>
    );
  }
}
