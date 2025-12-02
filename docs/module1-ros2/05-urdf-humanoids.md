---
sidebar_position: 5
---

# URDF for Humanoids: Describing Robots

## What is URDF?

**URDF (Unified Robot Description Format)** is an XML-based language for describing:
- **Links**: Rigid bodies (parts of the robot)
- **Joints**: Connections between links (motors, pivots)
- **Geometry**: Visual and collision models
- **Physical properties**: Mass, inertia, friction

Think of URDF as the "blueprint" of your robot.

---

## Why URDF Matters for Humanoids

Humanoid robots are complex:
- **20-40+ joints** (arms, legs, spine, head)
- **Hierarchical structure** (pelvis → spine → head, pelvis → legs)
- **Accurate physics** needed for simulation and control

URDF provides:
- A standard format for robot description
- Integration with Gazebo, RViz, and Isaac Sim
- Automatic kinematics and dynamics calculations

---

## URDF Structure: Links and Joints

### Basic Anatomy

```
base_link (pelvis)
  ├── left_hip_joint
  │    └── left_thigh_link
  │         └── left_knee_joint
  │              └── left_shin_link
  │                   └── left_ankle_joint
  │                        └── left_foot_link
  └── right_hip_joint
       └── right_thigh_link
            └── ...
```

### Minimal URDF Example

```xml
<?xml version="1.0"?>
<robot name="simple_robot">

  <!-- Base link (fixed to world) -->
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.2 0.2 0.1"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
  </link>

  <!-- Moving link -->
  <link name="arm_link">
    <visual>
      <geometry>
        <cylinder length="0.5" radius="0.05"/>
      </geometry>
      <material name="red">
        <color rgba="0.8 0 0 1"/>
      </material>
    </visual>
  </link>

  <!-- Joint connecting them -->
  <joint name="arm_joint" type="revolute">
    <parent link="base_link"/>
    <child link="arm_link"/>
    <origin xyz="0 0 0.1" rpy="0 0 0"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" effort="10" velocity="1.0"/>
  </joint>

</robot>
```

---

## Link Definition

A link defines a rigid body.

```xml
<link name="left_thigh">
  <!-- Visual (how it looks) -->
  <visual>
    <origin xyz="0 0 -0.2" rpy="0 0 0"/>
    <geometry>
      <cylinder length="0.4" radius="0.05"/>
    </geometry>
    <material name="gray">
      <color rgba="0.5 0.5 0.5 1"/>
    </material>
  </visual>

  <!-- Collision (for physics) -->
  <collision>
    <origin xyz="0 0 -0.2" rpy="0 0 0"/>
    <geometry>
      <cylinder length="0.4" radius="0.05"/>
    </geometry>
  </collision>

  <!-- Inertial properties (for dynamics) -->
  <inertial>
    <origin xyz="0 0 -0.2" rpy="0 0 0"/>
    <mass value="5.0"/>
    <inertia ixx="0.05" ixy="0" ixz="0"
             iyy="0.05" iyz="0"
             izz="0.01"/>
  </inertial>
</link>
```

**Key components**:
- **Visual**: Rendered in RViz/simulators
- **Collision**: Used for contact detection
- **Inertial**: Mass and inertia tensor (for physics)

---

## Joint Types

### 1. Fixed Joint

No movement (e.g., sensor mount).

```xml
<joint name="camera_joint" type="fixed">
  <parent link="head_link"/>
  <child link="camera_link"/>
  <origin xyz="0.05 0 0" rpy="0 0 0"/>
</joint>
```

### 2. Revolute Joint

Rotates around an axis with limits (e.g., elbow).

```xml
<joint name="elbow_joint" type="revolute">
  <parent link="upper_arm"/>
  <child link="forearm"/>
  <origin xyz="0 0 -0.3" rpy="0 0 0"/>
  <axis xyz="0 1 0"/>  <!-- Rotate around Y-axis -->
  <limit lower="0" upper="2.5" effort="50" velocity="2.0"/>
  <dynamics damping="0.7"/>
</joint>
```

### 3. Continuous Joint

Rotates continuously (no limits) - e.g., wheels.

```xml
<joint name="wheel_joint" type="continuous">
  <parent link="base_link"/>
  <child link="wheel"/>
  <origin xyz="0 0.15 0" rpy="-1.57 0 0"/>
  <axis xyz="0 0 1"/>
</joint>
```

### 4. Prismatic Joint

Slides along an axis (e.g., linear actuator).

```xml
<joint name="slider_joint" type="prismatic">
  <parent link="base"/>
  <child link="slider"/>
  <origin xyz="0 0 0" rpy="0 0 0"/>
  <axis xyz="0 0 1"/>  <!-- Slide along Z-axis -->
  <limit lower="0" upper="0.5" effort="100" velocity="0.5"/>
</joint>
```

---

## Humanoid URDF Example

A simplified biped robot structure:

```xml
<?xml version="1.0"?>
<robot name="simple_humanoid">

  <!-- Pelvis (base) -->
  <link name="pelvis">
    <visual>
      <geometry>
        <box size="0.3 0.2 0.15"/>
      </geometry>
      <material name="gray">
        <color rgba="0.5 0.5 0.5 1"/>
      </material>
    </visual>
    <inertial>
      <mass value="10.0"/>
      <inertia ixx="0.1" ixy="0" ixz="0"
               iyy="0.1" iyz="0"
               izz="0.1"/>
    </inertial>
  </link>

  <!-- Left Thigh -->
  <link name="left_thigh">
    <visual>
      <origin xyz="0 0 -0.2" rpy="0 0 0"/>
      <geometry>
        <cylinder length="0.4" radius="0.05"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
    <inertial>
      <origin xyz="0 0 -0.2" rpy="0 0 0"/>
      <mass value="5.0"/>
      <inertia ixx="0.05" ixy="0" ixz="0"
               iyy="0.05" iyz="0"
               izz="0.01"/>
    </inertial>
  </link>

  <!-- Left Hip Joint -->
  <joint name="left_hip" type="revolute">
    <parent link="pelvis"/>
    <child link="left_thigh"/>
    <origin xyz="0 0.1 -0.075" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>  <!-- Pitch (forward/backward) -->
    <limit lower="-0.5" upper="1.57" effort="100" velocity="2.0"/>
    <dynamics damping="1.0" friction="0.1"/>
  </joint>

  <!-- Left Shin -->
  <link name="left_shin">
    <visual>
      <origin xyz="0 0 -0.2" rpy="0 0 0"/>
      <geometry>
        <cylinder length="0.4" radius="0.04"/>
      </geometry>
      <material name="blue"/>
    </visual>
    <inertial>
      <origin xyz="0 0 -0.2" rpy="0 0 0"/>
      <mass value="3.0"/>
      <inertia ixx="0.03" ixy="0" ixz="0"
               iyy="0.03" iyz="0"
               izz="0.005"/>
    </inertial>
  </link>

  <!-- Left Knee Joint -->
  <joint name="left_knee" type="revolute">
    <parent link="left_thigh"/>
    <child link="left_shin"/>
    <origin xyz="0 0 -0.4" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit lower="0" upper="2.5" effort="80" velocity="2.0"/>
    <dynamics damping="0.8" friction="0.1"/>
  </joint>

  <!-- Repeat for right leg, arms, etc. -->

</robot>
```

---

## Using Meshes for Realistic Models

Instead of simple shapes, use 3D models (STL, DAE, OBJ).

```xml
<link name="torso">
  <visual>
    <geometry>
      <mesh filename="package://my_robot/meshes/torso.dae" scale="1 1 1"/>
    </geometry>
  </visual>
  <collision>
    <!-- Simplified collision shape -->
    <geometry>
      <box size="0.3 0.2 0.5"/>
    </geometry>
  </collision>
</link>
```

**Best practices**:
- Use detailed meshes for visuals
- Use simple shapes (boxes, cylinders) for collisions (faster simulation)

---

## Xacro: Programmatic URDF

URDF gets repetitive for complex robots. **Xacro** adds macros and variables.

### Example: Define a Leg Macro

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro" name="humanoid">

  <!-- Properties (variables) -->
  <xacro:property name="thigh_length" value="0.4"/>
  <xacro:property name="shin_length" value="0.4"/>
  <xacro:property name="leg_mass" value="5.0"/>

  <!-- Macro for a leg -->
  <xacro:macro name="leg" params="side reflect">

    <link name="${side}_thigh">
      <visual>
        <origin xyz="0 0 ${-thigh_length/2}" rpy="0 0 0"/>
        <geometry>
          <cylinder length="${thigh_length}" radius="0.05"/>
        </geometry>
      </visual>
      <inertial>
        <mass value="${leg_mass}"/>
        <inertia ixx="0.05" ixy="0" ixz="0"
                 iyy="0.05" iyz="0"
                 izz="0.01"/>
      </inertial>
    </link>

    <joint name="${side}_hip" type="revolute">
      <parent link="pelvis"/>
      <child link="${side}_thigh"/>
      <origin xyz="0 ${reflect*0.1} -0.075" rpy="0 0 0"/>
      <axis xyz="0 1 0"/>
      <limit lower="-0.5" upper="1.57" effort="100" velocity="2.0"/>
    </joint>

    <!-- Add shin, knee joint, etc. -->

  </xacro:macro>

  <!-- Base link -->
  <link name="pelvis">
    <!-- ... -->
  </link>

  <!-- Instantiate legs -->
  <xacro:leg side="left" reflect="1"/>
  <xacro:leg side="right" reflect="-1"/>

</robot>
```

### Converting Xacro to URDF

```bash
# Install xacro
sudo apt install ros-humble-xacro

# Convert to URDF
ros2 run xacro xacro robot.urdf.xacro > robot.urdf
```

---

## Visualizing URDFs in RViz

### Create a Launch File

Create `launch/view_robot.launch.py`:

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration, Command
from launch_ros.parameter_descriptions import ParameterValue
import os
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    # Get URDF file path
    urdf_file = os.path.join(
        get_package_share_directory('my_robot_description'),
        'urdf',
        'robot.urdf.xacro'
    )

    # Process xacro to URDF
    robot_description = ParameterValue(
        Command(['xacro ', urdf_file]),
        value_type=str
    )

    # Robot State Publisher (publishes TF transforms)
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': robot_description}]
    )

    # Joint State Publisher GUI (control joints manually)
    joint_state_publisher_gui = Node(
        package='joint_state_publisher_gui',
        executable='joint_state_publisher_gui'
    )

    # RViz
    rviz = Node(
        package='rviz2',
        executable='rviz2',
        arguments=['-d', os.path.join(
            get_package_share_directory('my_robot_description'),
            'rviz',
            'view_robot.rviz'
        )]
    )

    return LaunchDescription([
        robot_state_publisher,
        joint_state_publisher_gui,
        rviz
    ])
```

### Launch and View

```bash
ros2 launch my_robot_description view_robot.launch.py
```

You'll see:
- **RViz**: 3D visualization of your robot
- **Joint State Publisher GUI**: Sliders to move joints

---

## Common Humanoid Joint Hierarchies

### Typical Humanoid Structure

```
pelvis (base_link)
├── torso_joint → torso
│   ├── neck_joint → neck
│   │   └── head_joint → head
│   ├── left_shoulder → left_upper_arm
│   │   └── left_elbow → left_forearm
│   │       └── left_wrist → left_hand
│   └── right_shoulder → right_upper_arm
│       └── right_elbow → right_forearm
│           └── right_wrist → right_hand
├── left_hip → left_thigh
│   └── left_knee → left_shin
│       └── left_ankle → left_foot
└── right_hip → right_thigh
    └── right_knee → right_shin
        └── right_ankle → right_foot
```

**Joint counts**:
- Legs: 2 legs × 6 DOF = 12 joints
- Arms: 2 arms × 7 DOF = 14 joints
- Torso/Neck/Head: 3-5 joints
- **Total**: ~29-31 DOF for basic humanoid

---

## Best Practices

### 1. Start Simple

Begin with:
- Basic shapes (boxes, cylinders)
- Simplified kinematics
- Test in RViz before Gazebo

### 2. Use Consistent Naming

```xml
<!-- Good -->
left_hip_pitch_joint
left_knee_joint
left_ankle_roll_joint

<!-- Bad -->
joint1
j_left_2
leg_joint_L
```

### 3. Set Realistic Limits

```xml
<!-- Hip pitch (forward/backward) -->
<limit lower="-0.5" upper="1.57" effort="100" velocity="2.0"/>

<!-- Knee (only bends one way) -->
<limit lower="0" upper="2.5" effort="80" velocity="2.0"/>
```

### 4. Add Damping and Friction

```xml
<dynamics damping="1.0" friction="0.2"/>
```

Prevents unrealistic oscillations in simulation.

---

## Key Takeaways

:::tip Core Concepts
1. **URDF** describes robot structure (links and joints)
2. **Links** = rigid bodies with visual, collision, and inertial properties
3. **Joints** connect links (revolute, prismatic, continuous, fixed)
4. Use **Xacro** for parametric, reusable robot descriptions
5. **robot_state_publisher** publishes TF transforms from URDF
6. Visualize in **RViz**, simulate in **Gazebo**
7. Humanoids typically have **25-40 joints**
:::

---

## Check Your Understanding

1. What's the difference between visual and collision geometry?
2. Name the four main joint types in URDF.
3. What does the `<inertial>` tag contain?
4. How do you convert a Xacro file to URDF?
5. What's the purpose of `robot_state_publisher`?

---

## Hands-On Exercise

**Challenge**: Create a simple biped robot
- Pelvis (base)
- Two legs (thigh → knee → shin → foot)
- Use cylinders and boxes
- Add realistic joint limits
- View in RViz with `joint_state_publisher_gui`

**Bonus**: Add arms and a head!

---

## Next Steps

→ **Next**: [Launch Files](./06-launch-files.md) - Start multiple nodes elegantly

Or explore:
- [Exercises](./07-exercises.md) - Practice what you've learned

---

**Resources**:
- [URDF Tutorials](https://docs.ros.org/en/humble/Tutorials/Intermediate/URDF/URDF-Main.html)
- [Xacro Documentation](http://wiki.ros.org/xacro)
