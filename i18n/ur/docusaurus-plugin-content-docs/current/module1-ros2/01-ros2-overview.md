---
sidebar_position: 1
---

# ROS 2 کا جائزہ

## What is ROS 2?

**ROS 2 (Robot Operating System 2)** is a flexible framework for writing robot software. It is a collection of tools, libraries, and conventions that aim to simplify the task of creating complex and robust robot behavior across a wide variety of robotic platforms.

### Key Differences: ROS 1 vs ROS 2

| Feature | ROS 1 | ROS 2 |
|---------|-------|-------|
| **Communication** | Custom TCPROS | DDS (Data Distribution Service) |
| **Real-time** | Limited | Native support |
| **Security** | None | Built-in encryption |
| **Multi-robot** | Difficult | Native support |
| **Platforms** | Linux only | Linux, Windows, macOS |
| **Python** | Python 2 | Python 3 |

## Core Concepts

### 1. Nodes
A **node** is a process that performs computation. Robots typically have many nodes:
- Camera driver node
- Motor controller node
- Path planner node
- Localization node

### 2. Topics
**Topics** are named buses over which nodes exchange messages. They use a publish-subscribe model:
- Publishers send data
- Subscribers receive data
- Many-to-many communication

### 3. Services
**Services** are synchronous request-reply interactions:
- Client sends a request
- Server processes and returns a response
- One-to-one communication

### 4. Actions
**Actions** are for long-running tasks with feedback:
- Client sends a goal
- Server provides periodic feedback
- Client can cancel the goal

## ROS 2 Development Workflow

### 1. Create a Workspace
```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws
colcon build
source install/setup.bash
```

### 2. Create a Package
```bash
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python my_robot_pkg
```

### 3. Write a Node
```python
import rclpy
from rclpy.node import Node

class MyNode(Node):
    def __init__(self):
        super().__init__('my_node')
        self.get_logger().info('Node started!')

def main():
    rclpy.init()
    node = MyNode()
    rclpy.spin(node)
    rclpy.shutdown()
```

### 4. Build and Run
```bash
cd ~/ros2_ws
colcon build
source install/setup.bash
ros2 run my_robot_pkg my_node
```

## Essential ROS 2 CLI Commands

### Node Management
```bash
# List running nodes
ros2 node list

# Get node info
ros2 node info /my_node

# Kill a node
ros2 lifecycle set /my_node shutdown
```

### Topic Operations
```bash
# List all topics
ros2 topic list

# Echo topic messages
ros2 topic echo /camera/image

# Publish to a topic
ros2 topic pub /cmd_vel geometry_msgs/msg/Twist "{linear: {x: 0.5}}"

# Get topic info
ros2 topic info /scan
```

### Service Calls
```bash
# List services
ros2 service list

# Call a service
ros2 service call /add_two_ints example_interfaces/srv/AddTwoInts "{a: 5, b: 3}"

# Get service type
ros2 service type /spawn
```

### Parameter Management
```bash
# List parameters
ros2 param list

# Get parameter value
ros2 param get /my_node my_param

# Set parameter value
ros2 param set /my_node my_param 42
```

## ROS 2 for Humanoid Robots

Humanoid robots use ROS 2 extensively:

1. **Sensor Integration**: Cameras, IMUs, force sensors
2. **Motor Control**: Joint position/velocity/torque control
3. **State Estimation**: Localization and mapping
4. **Motion Planning**: Footstep planning, trajectory optimization
5. **Behavior Trees**: High-level decision making

### Example: Humanoid Robot Architecture

```
┌─────────────────────────────────────────┐
│         Behavior Layer                  │
│  (Task Planning, Decision Making)       │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         Motion Planning Layer           │
│  (Footstep Planning, Trajectory Gen)    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         Control Layer                   │
│  (Joint Controllers, Balance Control)   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│         Hardware Interface              │
│  (Motor Drivers, Sensor Readers)        │
└─────────────────────────────────────────┘
```

## Next Steps

In the following chapters, you will:
1. Learn about **nodes and topics** in detail
2. Understand **services and actions**
3. Write Python code with **rclpy**
4. Create **URDF models** for humanoid robots
5. Use **launch files** to start complex systems

---

**Questions?** Ask the AI chatbot (bottom-right) or continue to the next chapter.

[Next: Nodes & Topics →](./nodes-topics)


---

**نوٹ**: یہ صفحہ اردو میں دستیاب ہے۔ مکمل ترجمہ جلد شامل کیا جائے گا۔

