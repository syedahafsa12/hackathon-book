---
sidebar_position: 1
---

# Module 4: Vision-Language-Action (VLA)

import UrduNote from '@site/src/components/UrduToggle';

<UrduNote>
**VLA (Vision-Language-Action)**: یہ ماڈلز دیکھ سکتے ہیں (Vision)، سمجھ سکتے ہیں (Language)، اور کام کر سکتے ہیں (Action)۔
</UrduNote>

## The New Paradigm

Traditional robotics used separate modules for perception, planning, and control. VLA models (like Google's RT-2) do it all in one neural network.

## Components
1.  **Vision Encoder**: Understands the image (e.g., CLIP).
2.  **LLM**: Understands the command ("Pick up the apple").
3.  **Action Decoder**: Outputs robot actions (x, y, z, gripper).
