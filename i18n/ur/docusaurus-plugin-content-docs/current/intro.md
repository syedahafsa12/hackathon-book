---
sidebar_position: 1
slug: /
---

# Welcome to Physical AI & Humanoid Robotics

## Bridging the Digital Brain with the Physical Body

Welcome to the future of artificial intelligence. While AI has revolutionized digital spaces—from chatbots to image generators—the next frontier is **Physical AI**: intelligent systems that understand and interact with the physical world.

This quarter-long course will take you on a journey from basic robot control to deploying autonomous humanoid robots capable of natural human interactions.

## What You'll Build

By the end of this course, you'll create an **Autonomous Humanoid Robot** that can:

- 🎤 **Listen** to voice commands using OpenAI Whisper
- 🧠 **Think** using Large Language Models to plan actions
- 👀 **See** its environment using computer vision and VSLAM
- 🚶 **Move** through spaces using Nav2 path planning
- 🤖 **Act** by manipulating objects and navigating obstacles

All of this will be simulated in photorealistic environments using **NVIDIA Isaac Sim** and controlled through **ROS 2**.

## Why Physical AI Matters

Humanoid robots are uniquely positioned to thrive in our human-centered world. Consider:

- **Physical Form**: They share our shape, allowing them to use human tools and spaces
- **Training Data**: Billions of hours of human video and interaction data exist
- **Real-World Impact**: From elderly care to disaster response, embodied AI solves problems digital AI cannot

Companies like **Tesla** (Optimus), **Figure AI**, **Agility Robotics** (Digit), and **Unitree** are racing to bring humanoid robots to market. This course gives you the skills to join this revolution.

## Course Structure

###  📚 Six Modules

1. **Module 0: Introduction to Physical AI** (Weeks 1-2)
   - What is embodied intelligence?
   - The humanoid robotics landscape
   - Prerequisites and setup

2. **Module 1: The Robotic Nervous System - ROS 2** (Weeks 3-5)
   - Nodes, topics, services, and actions
   - Building ROS 2 packages with Python
   - URDF for humanoid robot description

3. **Module 2: The Digital Twin - Gazebo & Unity** (Weeks 6-7)
   - Physics simulation fundamentals
   - Sensor simulation (LiDAR, depth cameras, IMUs)
   - High-fidelity rendering

4. **Module 3: The AI-Robot Brain - NVIDIA Isaac** (Weeks 8-10)
   - Isaac Sim for photorealistic simulation
   - Isaac ROS for hardware-accelerated VSLAM
   - Synthetic data generation and reinforcement learning

5. **Module 4: Vision-Language-Action (VLA)** (Weeks 11-12)
   - Voice-to-Action pipelines
   - LLMs for cognitive planning
   - Multi-modal interaction

6. **Module 5: Capstone Project** (Week 13)
   - Integrate everything into an autonomous humanoid
   - Voice command → perception → planning → action
   - Present your working demo

### 🛠️ What Makes This Course Unique

**Interactive Learning**
- Working code examples you can run immediately
- Interactive exercises with real-time feedback
- AI assistant to answer your questions 24/7

**Industry-Standard Tools**
- ROS 2 (used by Waymo, NASA, Boston Dynamics)
- NVIDIA Isaac (state-of-the-art simulation platform)
- Real hardware deployment guidelines

**Practical Focus**
- Every concept connects to the capstone project
- Hybrid code examples: snippets for basics, full packages for complex systems
- Hardware setup guides for actual robot deployment

## Prerequisites (ضروری چیزیں)

### Required Background

**Programming**
- Python (intermediate level)
- Basic understanding of functions, classes, and async/await
- Git version control basics

**Mathematics**
- Linear algebra (vectors, matrices, transformations)
- Basic calculus (derivatives, gradients)
- Probability fundamentals

**AI/ML**
- Neural networks basics
- Reinforcement learning concepts (helpful, not required)

**Systems**
- Linux command line (Ubuntu recommended)
- Basic understanding of processes and networking

### Hardware Requirements

**For Simulation** (MVP - Most Critical)
- NVIDIA RTX 4070 Ti (12GB VRAM) or higher
- Intel i7 13th Gen or AMD Ryzen 9
- 32GB RAM (64GB recommended)
- Ubuntu 22.04 LTS
- 100GB free SSD space

**For Physical Deployment** (Optional, covered in Module 6)
- NVIDIA Jetson Orin Nano (8GB) or Orin NX (16GB)
- Intel RealSense D435i depth camera
- Robot platform (Unitree, Robotis, or similar)

**Cloud Alternative**
- AWS g5.2xlarge instances (~$1.50/hour)
- See Module 6 for complete cloud setup guide

:::tip Don't Have the Hardware Yet?
You can start with Modules 0-1 on any computer. The hardware requirements kick in from Module 2 onwards when we begin simulation.
:::

## Learning Outcomes

By completing this course, you will be able to:

1. ✅ Design and implement ROS 2-based robot control systems
2. ✅ Simulate complex robot behaviors in Gazebo and Isaac Sim
3. ✅ Leverage NVIDIA Isaac for AI-powered perception and navigation
4. ✅ Integrate LLMs with robotic action execution
5. ✅ Deploy AI models from simulation to physical hardware
6. ✅ Build autonomous systems that understand natural language commands

## How to Use This Course

### Linear Path (Recommended for Beginners)
Follow modules sequentially from 0 → 5. Each module builds on the previous one.

### Project-First (For Experienced Developers)
1. Start with Module 5 (Capstone) to see the end goal
2. Jump to modules as needed when you hit knowledge gaps
3. Use the AI chatbot to fill in missing context

### Modular Learning
Pick specific skills:
- **Just ROS 2?** Module 1 is self-contained
- **Just Simulation?** Module 2 (Gazebo/Unity)
- **Just NVIDIA Isaac?** Module 3
- **Just Voice Control?** Module 4

## Course Features

### 🤖 AI Teaching Assistant
Click the chat icon (bottom-right) to ask questions anytime. The RAG-powered chatbot knows the entire course content and can:
- Explain concepts in different ways
- Debug your code
- Provide additional examples
- Link to relevant sections

### 📊 Progress Tracking
Your progress is automatically saved. Track:
- Chapters completed
- Bookmarked sections
- Estimated time remaining
- Learning streaks

### 🌐 Multi-Language Support
Course available in:
- English (en)
- اردو (Urdu) - Use the language switcher in the top-right

### 📥 Downloadable Code
Every code example can be:
- Copied to clipboard
- Downloaded as a file
- Cloned as a complete ROS 2 workspace

## Community and Support

### Ask Questions
- Use the AI chatbot for instant help
- Join our Discord community (link in footer)
- Open GitHub issues for bugs or suggestions

### Contribute
This course is open-source. Help improve it:
- Fix typos or improve explanations
- Add translations
- Contribute code examples
- Share your capstone projects

## Ready to Begin?

Choose your path:

1. **Start Learning** → [Module 0: What is Physical AI?](./module0-intro/01-what-is-physical-ai.md)
2. **See the End Goal** → [Module 5: Capstone Project](./module5-capstone/01-project-overview.md)
3. **Setup Hardware** → [Module 6: Hardware Setup](./module6-hardware/01-workstation-setup.md)

---

## Course Information

**Duration**: 13 weeks (3 months)
**Difficulty**: Intermediate to Advanced
**Prerequisites**: Python, Linux basics, AI/ML fundamentals
**Certificate**: Upon completion of capstone project

**Questions?** Click the chat icon below or start with [Module 0](./module0-intro/01-what-is-physical-ai.md).

:::info Your Journey Starts Here
Physical AI is not science fiction—it's the present. Companies are deploying humanoid robots in warehouses, hospitals, and homes **right now**. By mastering this course, you'll have the skills to shape this future.

Let's begin. 🚀
:::


---

**نوٹ**: یہ صفحہ اردو میں دستیاب ہے۔ مکمل ترجمہ جلد شامل کیا جائے گا۔

