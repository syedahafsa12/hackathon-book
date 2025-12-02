---
sidebar_position: 7
---

# Module 1 Exercises: Master ROS 2

## Overview

These hands-on exercises reinforce everything you've learned in Module 1. Each exercise builds on previous concepts, culminating in a mini-project that integrates all ROS 2 skills.

**Estimated time**: 4-6 hours total

---

## Exercise 1: Temperature Monitor System

**Difficulty**: Beginner
**Topics**: Nodes, Topics, Publishers, Subscribers
**Time**: 30-45 minutes

### Objective

Create a system that monitors robot temperature and logs warnings.

### Requirements

1. **Publisher Node** (`temperature_sensor_node`):
   - Publishes fake temperature data to `/robot/temperature`
   - Use `std_msgs/Float32`
   - Temperature oscillates between 50°C and 90°C (use `math.sin()`)
   - Publish at 2 Hz

2. **Subscriber Node** (`temperature_monitor_node`):
   - Subscribes to `/robot/temperature`
   - Logs:
     - `INFO`: Temperature value every reading
     - `WARN`: If temperature > 80°C
     - `ERROR`: If temperature > 85°C

### Starter Code

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import math

class TemperatureSensor(Node):
    def __init__(self):
        super().__init__('temperature_sensor')
        # TODO: Create publisher
        # TODO: Create timer (0.5 seconds)
        self.time = 0.0

    def timer_callback(self):
        # TODO: Calculate temperature (50 + 20 * sin(time))
        # TODO: Publish temperature
        # TODO: Increment time
        pass

def main(args=None):
    rclpy.init(args=args)
    node = TemperatureSensor()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Success Criteria

- Publisher sends temperature data at 2 Hz
- Subscriber receives and logs all temperatures
- Warnings appear when temperature > 80°C
- Errors appear when temperature > 85°C

### Bonus Challenges

1. Add a parameter `warning_threshold` (default: 80.0)
2. Publish temperature in Celsius and Fahrenheit simultaneously (two topics)
3. Add a service `/get_current_temperature` that returns the latest reading

---

## Exercise 2: Robot Mode Controller

**Difficulty**: Intermediate
**Topics**: Services, Parameters
**Time**: 45-60 minutes

### Objective

Create a service that switches robot operating modes and validates transitions.

### Requirements

1. **Service Server** (`mode_controller_node`):
   - Service name: `/set_mode`
   - Custom service type: `SetMode.srv`
     ```
     string mode
     ---
     bool success
     string message
     ```
   - Valid modes: "idle", "autonomous", "manual", "emergency_stop"
   - State transitions:
     - From "idle": Can go to "autonomous" or "manual"
     - From "autonomous"/"manual": Can go to "idle" or "emergency_stop"
     - From "emergency_stop": Can only go to "idle"

2. **Service Client** (`mode_client_node`):
   - Accepts command line argument for target mode
   - Calls `/set_mode` service
   - Prints result

### Creating Custom Service

Create `srv/SetMode.srv`:
```
string mode
---
bool success
string message
```

Add to `CMakeLists.txt` or `setup.py` (Python):
```python
# In setup.py, add:
from setuptools import setup

setup(
    # ... other fields ...
    package_data={
        'my_robot_tutorials': ['srv/SetMode.srv'],
    },
)
```

### Success Criteria

- Server validates mode transitions correctly
- Invalid transitions return `success=false` with explanation
- Client displays server response
- Current mode is stored and logged

### Bonus Challenges

1. Add a parameter `/initial_mode` (default: "idle")
2. Publish current mode to `/robot/current_mode` at 1 Hz
3. Create a timer that auto-switches to "emergency_stop" if no service call for 30 seconds

---

## Exercise 3: Simple Object Follower

**Difficulty**: Intermediate
**Topics**: Topics, Timers, QoS
**Time**: 60-90 minutes

### Objective

Create a node that simulates following a detected object by publishing velocity commands.

### Requirements

1. **Object Detector Node** (provided - simulates object detection):
   - Publishes to `/detected_object/position`
   - Message type: `geometry_msgs/Point`
   - Simulates an object moving in a circle

2. **Follower Controller Node** (you implement):
   - Subscribes to `/detected_object/position`
   - Publishes to `/cmd_vel` (`geometry_msgs/Twist`)
   - Control logic:
     - If object.x > 0.5: Move forward
     - If object.x < -0.5: Move backward
     - If object.y > 0.2: Turn left
     - If object.y < -0.2: Turn right
   - Use parameters for thresholds

### Provided Object Detector

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Point
import math

class ObjectDetector(Node):
    def __init__(self):
        super().__init__('object_detector')
        self.publisher_ = self.create_publisher(Point, '/detected_object/position', 10)
        self.timer = self.create_timer(0.1, self.timer_callback)
        self.time = 0.0

    def timer_callback(self):
        msg = Point()
        # Simulate object moving in circle
        msg.x = 0.5 * math.cos(self.time)
        msg.y = 0.5 * math.sin(self.time)
        msg.z = 0.0

        self.publisher_.publish(msg)
        self.time += 0.1

def main(args=None):
    rclpy.init(args=args)
    node = ObjectDetector()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Success Criteria

- Follower node subscribes to object position
- Publishes appropriate velocity commands based on object location
- Uses parameters for thresholds
- Logs current control state (forward/backward/turn)

### Bonus Challenges

1. Add proportional control (speed proportional to distance)
2. Use QoS `BEST_EFFORT` for sensor data
3. Visualize in RViz with turtle sim

---

## Exercise 4: Battery Management Action

**Difficulty**: Advanced
**Topics**: Actions, Feedback
**Time**: 90-120 minutes

### Objective

Create an action server that simulates charging a robot battery with progress feedback.

### Requirements

1. **Action Definition** (`ChargeBattery.action`):
   ```
   # Goal
   int32 target_percentage  # Target charge level (0-100)
   ---
   # Result
   int32 final_percentage
   float32 time_elapsed
   bool success
   ---
   # Feedback
   int32 current_percentage
   float32 estimated_time_remaining
   ```

2. **Action Server** (`battery_charger_node`):
   - Action name: `/charge_battery`
   - Simulates charging from current level to target
   - Charges at 10% per second
   - Publishes feedback every 0.5 seconds
   - Can be canceled (stops charging immediately)
   - Publishes current battery level to `/battery/level`

3. **Action Client** (`charge_client_node`):
   - Sends goal to charge to specified level
   - Prints feedback as charging progresses
   - Prints final result

### Success Criteria

- Action server charges from 0% to target
- Feedback published every 0.5 seconds
- Client receives and displays feedback
- Cancellation works correctly (stops mid-charge)
- Battery level topic updates continuously

### Bonus Challenges

1. Add parameters for charge rate (default: 10%/s)
2. Simulate battery drain while not charging
3. Add "fast charge" mode (20%/s but only works up to 80%)
4. Create a service `/get_battery_status` that returns current level

---

## Exercise 5: URDF Humanoid Builder

**Difficulty**: Intermediate
**Topics**: URDF, Xacro, Visualization
**Time**: 90-120 minutes

### Objective

Create a simplified humanoid robot URDF and visualize it in RViz.

### Requirements

1. **Robot Structure**:
   - Pelvis (base_link)
   - Torso
   - Head
   - Two arms (upper_arm, forearm, hand)
   - Two legs (thigh, shin, foot)

2. **Joints**:
   - Torso: Fixed to pelvis
   - Head: Revolute (pitch and yaw)
   - Shoulders: Revolute (3 DOF each)
   - Elbows: Revolute (1 DOF each)
   - Hips: Revolute (3 DOF each)
   - Knees: Revolute (1 DOF each)
   - Ankles: Revolute (2 DOF each)

3. **Geometry**:
   - Use simple shapes (boxes, cylinders, spheres)
   - Set realistic dimensions (human-scale)
   - Add colors for different parts

4. **Xacro Macros**:
   - Create a macro for legs (reuse for left/right)
   - Create a macro for arms (reuse for left/right)

### Starter Template

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="simple_humanoid">

  <!-- Properties -->
  <xacro:property name="pelvis_width" value="0.3"/>
  <xacro:property name="pelvis_height" value="0.15"/>

  <!-- Base link (pelvis) -->
  <link name="pelvis">
    <visual>
      <geometry>
        <box size="${pelvis_width} 0.2 ${pelvis_height}"/>
      </geometry>
      <material name="gray">
        <color rgba="0.5 0.5 0.5 1"/>
      </material>
    </visual>
    <inertial>
      <mass value="10.0"/>
      <inertia ixx="0.1" ixy="0" ixz="0" iyy="0.1" iyz="0" izz="0.1"/>
    </inertial>
  </link>

  <!-- TODO: Add torso, head, arms, legs -->

  <!-- Leg macro -->
  <xacro:macro name="leg" params="side reflect">
    <!-- TODO: Implement leg (thigh, knee, shin, ankle, foot) -->
  </xacro:macro>

  <!-- Instantiate legs -->
  <xacro:leg side="left" reflect="1"/>
  <xacro:leg side="right" reflect="-1"/>

</robot>
```

### Success Criteria

- URDF loads without errors
- All joints visible in RViz
- Joint State Publisher GUI shows all joints
- Robot maintains realistic proportions
- Xacro macros successfully generate left/right limbs

### Bonus Challenges

1. Add mesh files for realistic appearance
2. Add collision geometries (simplified shapes)
3. Add Gazebo plugins for simulation
4. Create a launch file that starts RViz with custom config

---

## Exercise 6: Multi-Node Launch System

**Difficulty**: Advanced
**Topics**: Launch Files, Integration
**Time**: 60-90 minutes

### Objective

Create a comprehensive launch file that starts an entire robot system.

### Requirements

1. **Launch File** (`robot_system.launch.py`):
   - Start robot_state_publisher with URDF from Exercise 5
   - Start temperature sensor (Exercise 1)
   - Start temperature monitor (Exercise 1)
   - Start mode controller (Exercise 2)
   - Start RViz with custom config
   - All conditional based on launch arguments

2. **Launch Arguments**:
   - `robot_name` (default: "humanoid")
   - `use_rviz` (default: true)
   - `use_sim` (default: true)
   - `monitor_temperature` (default: true)

3. **Parameters**:
   - Load from YAML file (`config/robot_params.yaml`)
   - Set namespaces for sensor nodes

### Sample Launch File Structure

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch.conditions import IfCondition
from launch_ros.actions import Node

def generate_launch_description():
    # TODO: Declare arguments

    # TODO: Load URDF

    # TODO: Create nodes

    # TODO: Return LaunchDescription with all nodes

    pass
```

### Success Criteria

- Launch file starts all nodes correctly
- Arguments work (can toggle RViz, monitoring, etc.)
- Parameters loaded from YAML
- Namespaces prevent topic conflicts
- Can stop entire system with Ctrl+C

### Bonus Challenges

1. Add event handler to restart temperature monitor if it crashes
2. Include another launch file (e.g., navigation stack)
3. Add logging to file
4. Create multiple robot_params.yaml files for different configurations

---

## Mini-Project: Autonomous Delivery Robot Controller

**Difficulty**: Expert
**Topics**: All Module 1 concepts
**Time**: 3-4 hours

### Objective

Build a complete ROS 2 system for a simulated delivery robot that:
1. Receives destination goals
2. Plans and executes navigation
3. Monitors battery and health
4. Reports status via topics and services

### System Architecture

```
Delivery Robot System
├── Hardware Interface (Simulated)
│   ├── /battery_monitor (publishes battery level)
│   ├── /motor_controller (subscribes to cmd_vel)
│   └── /sensor_driver (publishes laser scan)
├── Navigation
│   ├── /path_planner (action server: NavigateToGoal)
│   └── /obstacle_avoider (subscribes to scan, publishes cmd_vel)
├── Task Management
│   ├── /task_manager (receives delivery goals)
│   └── /status_reporter (publishes robot status)
└── Monitoring
    ├── /health_monitor (monitors battery, sensors)
    └── /emergency_stop (service to halt robot)
```

### Requirements

#### 1. Battery Monitor Node
- Publishes `/battery/level` (std_msgs/Int32): 0-100%
- Simulates drain: -1% per second while moving, -0.1% while idle
- Publishes warnings when < 20%

#### 2. Simple Navigator Action Server
- Action: `NavigateToGoal.action`
  ```
  # Goal
  geometry_msgs/Point target_position
  ---
  # Result
  bool reached_goal
  float32 distance_traveled
  ---
  # Feedback
  geometry_msgs/Point current_position
  float32 distance_remaining
  ```
- Simulates movement toward goal at 0.5 m/s
- Provides feedback every 0.5 seconds
- Fails if battery < 10%

#### 3. Health Monitor Node
- Subscribes to `/battery/level`
- Publishes `/robot/status` (custom message):
  ```
  string state  # "OK", "WARNING", "CRITICAL"
  int32 battery_level
  string[] active_warnings
  ```
- Warnings:
  - Battery < 20%: "Low battery"
  - Battery < 10%: "Critical battery"

#### 4. Emergency Stop Service
- Service: `/emergency_stop`
- Type: `std_srvs/Trigger`
- Cancels all active goals
- Sets robot state to "STOPPED"

#### 5. Launch File
- Starts all nodes
- Loads parameters from YAML
- Optionally starts RViz
- Includes URDF from Exercise 5

### Deliverables

1. All node source files
2. Custom message/service/action definitions
3. Launch file with arguments
4. Parameter YAML file
5. README with usage instructions

### Testing Scenarios

1. **Basic Navigation**: Send goal, robot reaches it
2. **Low Battery**: Navigation fails when battery < 10%
3. **Emergency Stop**: Service cancels active navigation
4. **Health Monitoring**: Warnings appear at correct battery levels

### Success Criteria

- All nodes start without errors
- Action server completes navigation goals
- Battery drains realistically
- Emergency stop works immediately
- Health status updates correctly
- Launch file configures entire system

---

## Submission Guidelines

For each exercise:

1. **Code**: Well-commented Python files
2. **Package Structure**: Proper ROS 2 package with:
   - `package.xml`
   - `setup.py`
   - Launch files in `launch/`
   - Config files in `config/`
3. **Documentation**: Brief README explaining:
   - How to build and run
   - Expected output
   - Any assumptions made

---

## Evaluation Rubric

| Criteria | Weight | Description |
|----------|--------|-------------|
| **Functionality** | 40% | Code works as specified |
| **Code Quality** | 20% | Clean, readable, commented |
| **ROS 2 Best Practices** | 20% | Proper use of patterns, naming |
| **Documentation** | 10% | Clear instructions and comments |
| **Bonus Features** | 10% | Extra challenges completed |

---

## Getting Help

- Review chapter materials
- Check ROS 2 documentation
- Use `ros2 doctor` to diagnose issues
- Ask the AI chatbot for hints (but try first!)

---

## Next Steps

Once you've completed these exercises, you're ready for:

→ **Module 2**: [Gazebo & Unity Simulation](../module2-gazebo-unity/01-simulation-fundamentals.md)

Or explore:
- [ROS 2 Packages Index](https://index.ros.org/)
- [ROS 2 GitHub Examples](https://github.com/ros2/examples)

---

**Congratulations!** You've mastered ROS 2 fundamentals. You can now build distributed robotic systems, create custom messages and services, and orchestrate complex launch configurations.

**Keep building! 🤖**


---

**نوٹ**: یہ صفحہ اردو میں دستیاب ہے۔ مکمل ترجمہ جلد شامل کیا جائے گا۔

