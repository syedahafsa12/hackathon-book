---
sidebar_position: 1
---

# Module 5: Capstone Project

import UrduNote from '@site/src/components/UrduToggle';

<UrduNote>
**Capstone Project**: یہ کورس کا آخری پروجیکٹ ہے جس میں آپ سب کچھ اکٹھا استعمال کریں گے۔
</UrduNote>

## The Goal

Build an autonomous humanoid robot that can:
1.  **Listen**: Receive a voice command ("Go to the kitchen and bring me a soda").
2.  **Plan**: Decompose the task into steps.
3.  **Navigate**: Move safely to the kitchen.
4.  **Perceive**: Find the soda can.
5.  **Act**: Grasp the can and return.

## Architecture
*   **Brain**: LLM (e.g., Llama 3) running on Edge.
*   **Body**: ROS 2 control loop.
*   **Eyes**: RealSense Depth Camera.
