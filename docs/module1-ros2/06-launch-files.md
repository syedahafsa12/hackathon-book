---
sidebar_position: 6
---

# Launch Files: Orchestrating Robot Systems

## Why Launch Files?

Imagine starting a humanoid robot system:
```bash
# Terminal 1
ros2 run robot_driver motor_controller

# Terminal 2
ros2 run robot_driver sensor_reader

# Terminal 3
ros2 run robot_navigation planner

# Terminal 4
ros2 run robot_vision object_detector

# Terminal 5...
```

This is **tedious and error-prone**. **Launch files** solve this by:
- Starting multiple nodes with one command
- Setting parameters
- Remapping topics
- Managing node dependencies

---

## Python Launch Files (ROS 2 Standard)

ROS 2 uses Python for launch files (not XML like ROS 1).

### Basic Launch File

Create `launch/simple_launch.py`:

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        # Node 1
        Node(
            package='my_robot_tutorials',
            executable='simple_publisher',
            name='publisher_node',
            output='screen'
        ),

        # Node 2
        Node(
            package='my_robot_tutorials',
            executable='simple_subscriber',
            name='subscriber_node',
            output='screen'
        )
    ])
```

### Running the Launch File

```bash
ros2 launch my_robot_tutorials simple_launch.py
```

Both nodes start together!

---

## Setting Parameters

### Method 1: Inline Parameters

```python
Node(
    package='my_robot_control',
    executable='controller',
    parameters=[{
        'max_speed': 1.5,
        'robot_name': 'atlas',
        'debug_mode': True
    }]
)
```

### Method 2: YAML Parameter File

Create `config/robot_params.yaml`:
```yaml
controller:
  ros__parameters:
    max_speed: 1.5
    robot_name: "atlas"
    debug_mode: true
```

Load in launch file:
```python
import os
from ament_index_python.packages import get_package_share_directory

config_file = os.path.join(
    get_package_share_directory('my_robot_control'),
    'config',
    'robot_params.yaml'
)

Node(
    package='my_robot_control',
    executable='controller',
    parameters=[config_file]
)
```

---

## Remapping Topics

Remap topics to connect nodes without changing code.

```python
Node(
    package='image_processor',
    executable='detector',
    remappings=[
        ('/camera/image', '/front_camera/image_raw'),
        ('/detections', '/objects/detected')
    ]
)
```

**Use case**: Use the same node with different cameras.

---

## Namespaces

Organize nodes with namespaces to avoid naming conflicts.

```python
# Without namespace
Node(
    package='robot_driver',
    executable='motor_controller'
)
# Creates: /motor_controller

# With namespace
Node(
    package='robot_driver',
    executable='motor_controller',
    namespace='robot1'
)
# Creates: /robot1/motor_controller

# Topics become: /robot1/cmd_vel, /robot1/joint_states, etc.
```

**Use case**: Multi-robot systems.

---

## Launch Arguments

Make launch files configurable.

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    # Declare argument
    robot_name_arg = DeclareLaunchArgument(
        'robot_name',
        default_value='atlas',
        description='Name of the robot'
    )

    # Use argument
    robot_name = LaunchConfiguration('robot_name')

    controller_node = Node(
        package='my_robot_control',
        executable='controller',
        parameters=[{
            'robot_name': robot_name
        }]
    )

    return LaunchDescription([
        robot_name_arg,
        controller_node
    ])
```

### Running with Arguments

```bash
# Use default
ros2 launch my_robot_control robot.launch.py

# Override argument
ros2 launch my_robot_control robot.launch.py robot_name:=optimus
```

---

## Conditional Execution

Start nodes conditionally.

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch.conditions import IfCondition
from launch_ros.actions import Node

def generate_launch_description():
    use_sim_arg = DeclareLaunchArgument(
        'use_sim',
        default_value='true',
        choices=['true', 'false']
    )

    use_sim = LaunchConfiguration('use_sim')

    # Only start if use_sim=true
    sim_node = Node(
        package='gazebo_ros',
        executable='gazebo',
        condition=IfCondition(use_sim)
    )

    return LaunchDescription([
        use_sim_arg,
        sim_node
    ])
```

---

## Including Other Launch Files

Compose complex systems from smaller launch files.

```python
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
import os
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    # Include navigation launch file
    nav_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            os.path.join(
                get_package_share_directory('nav2_bringup'),
                'launch',
                'navigation_launch.py'
            )
        ])
    )

    # Include perception launch file
    perception_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            os.path.join(
                get_package_share_directory('my_perception'),
                'launch',
                'perception.launch.py'
            )
        ]),
        launch_arguments={'camera': 'front_camera'}.items()
    )

    return LaunchDescription([
        nav_launch,
        perception_launch
    ])
```

---

## Robot State Publisher Launch

Standard pattern for publishing robot description.

```python
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration, Command
from launch_ros.parameter_descriptions import ParameterValue
import os
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    # Path to URDF
    urdf_file = os.path.join(
        get_package_share_directory('my_robot_description'),
        'urdf',
        'robot.urdf.xacro'
    )

    # Process xacro
    robot_description = ParameterValue(
        Command(['xacro ', urdf_file]),
        value_type=str
    )

    # Robot State Publisher
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': robot_description}],
        output='screen'
    )

    # Joint State Publisher (for testing)
    joint_state_publisher = Node(
        package='joint_state_publisher_gui',
        executable='joint_state_publisher_gui',
        output='screen'
    )

    # RViz
    rviz = Node(
        package='rviz2',
        executable='rviz2',
        arguments=['-d', os.path.join(
            get_package_share_directory('my_robot_description'),
            'rviz',
            'view_robot.rviz'
        )],
        output='screen'
    )

    return LaunchDescription([
        robot_state_publisher,
        joint_state_publisher,
        rviz
    ])
```

---

## Gazebo Launch Example

Launch robot in Gazebo simulator.

```python
from launch import LaunchDescription
from launch.actions import ExecuteProcess, IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch_ros.actions import Node
import os
from ament_index_python.packages import get_package_share_directory

def generate_launch_description():
    # Start Gazebo
    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            os.path.join(
                get_package_share_directory('gazebo_ros'),
                'launch',
                'gazebo.launch.py'
            )
        ]),
        launch_arguments={'world': 'empty.world'}.items()
    )

    # Spawn robot in Gazebo
    spawn_entity = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=[
            '-topic', '/robot_description',
            '-entity', 'my_robot',
            '-x', '0.0',
            '-y', '0.0',
            '-z', '0.5'
        ],
        output='screen'
    )

    return LaunchDescription([
        gazebo,
        spawn_entity
    ])
```

---

## Event Handlers

Execute actions in response to events.

```python
from launch import LaunchDescription
from launch.actions import RegisterEventHandler, LogInfo
from launch.event_handlers import OnProcessExit
from launch_ros.actions import Node

def generate_launch_description():
    node1 = Node(
        package='my_package',
        executable='node1',
        name='first_node'
    )

    # Execute when node1 exits
    node1_exit_handler = RegisterEventHandler(
        OnProcessExit(
            target_action=node1,
            on_exit=[
                LogInfo(msg='Node1 exited, starting Node2'),
                Node(
                    package='my_package',
                    executable='node2',
                    name='second_node'
                )
            ]
        )
    )

    return LaunchDescription([
        node1,
        node1_exit_handler
    ])
```

---

## Real-World Example: Humanoid Robot Launch

Complete launch file for a humanoid robot system.

```python
#!/usr/bin/env python3
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, IncludeLaunchDescription
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution, Command
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.conditions import IfCondition
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare
from launch_ros.parameter_descriptions import ParameterValue
import os

def generate_launch_description():
    # Arguments
    use_sim_arg = DeclareLaunchArgument(
        'use_sim',
        default_value='true',
        description='Start Gazebo simulation'
    )

    use_rviz_arg = DeclareLaunchArgument(
        'use_rviz',
        default_value='true',
        description='Start RViz'
    )

    robot_name_arg = DeclareLaunchArgument(
        'robot_name',
        default_value='humanoid',
        description='Name of the robot'
    )

    # Configuration
    use_sim = LaunchConfiguration('use_sim')
    use_rviz = LaunchConfiguration('use_rviz')
    robot_name = LaunchConfiguration('robot_name')

    # Paths
    pkg_share = FindPackageShare('humanoid_robot')

    urdf_file = PathJoinSubstitution([
        pkg_share,
        'urdf',
        'humanoid.urdf.xacro'
    ])

    rviz_config = PathJoinSubstitution([
        pkg_share,
        'rviz',
        'humanoid.rviz'
    ])

    # Robot description
    robot_description = ParameterValue(
        Command(['xacro ', urdf_file, ' robot_name:=', robot_name]),
        value_type=str
    )

    # Robot State Publisher
    robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        parameters=[{'robot_description': robot_description}],
        output='screen'
    )

    # Gazebo (conditional)
    gazebo_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([
            PathJoinSubstitution([
                FindPackageShare('gazebo_ros'),
                'launch',
                'gazebo.launch.py'
            ])
        ]),
        condition=IfCondition(use_sim)
    )

    spawn_robot = Node(
        package='gazebo_ros',
        executable='spawn_entity.py',
        arguments=[
            '-topic', '/robot_description',
            '-entity', robot_name
        ],
        condition=IfCondition(use_sim),
        output='screen'
    )

    # Controllers
    controller_manager = Node(
        package='controller_manager',
        executable='ros2_control_node',
        parameters=[{
            'robot_description': robot_description,
            'use_sim_time': use_sim
        }],
        output='screen'
    )

    # RViz (conditional)
    rviz = Node(
        package='rviz2',
        executable='rviz2',
        arguments=['-d', rviz_config],
        condition=IfCondition(use_rviz),
        output='screen'
    )

    return LaunchDescription([
        # Arguments
        use_sim_arg,
        use_rviz_arg,
        robot_name_arg,

        # Nodes
        robot_state_publisher,
        gazebo_launch,
        spawn_robot,
        controller_manager,
        rviz
    ])
```

### Usage

```bash
# Launch with simulation and RViz
ros2 launch humanoid_robot humanoid.launch.py

# Launch without simulation (real robot)
ros2 launch humanoid_robot humanoid.launch.py use_sim:=false

# Launch without RViz
ros2 launch humanoid_robot humanoid.launch.py use_rviz:=false

# Custom robot name
ros2 launch humanoid_robot humanoid.launch.py robot_name:=atlas
```

---

## Best Practices

### 1. Use Meaningful Argument Names

```python
# Good
DeclareLaunchArgument('max_velocity', default_value='1.5')

# Bad
DeclareLaunchArgument('v', default_value='1.5')
```

### 2. Provide Descriptions

```python
DeclareLaunchArgument(
    'robot_name',
    default_value='atlas',
    description='Name of the humanoid robot to launch'
)
```

### 3. Organize with Comments

```python
return LaunchDescription([
    # === Arguments ===
    use_sim_arg,
    robot_name_arg,

    # === Core Nodes ===
    robot_state_publisher,
    controller_manager,

    # === Simulation ===
    gazebo_launch,
    spawn_robot,

    # === Visualization ===
    rviz
])
```

### 4. Use Configuration Files

Separate parameters from launch logic:
- Launch file: What to start
- YAML file: How to configure

---

## Debugging Launch Files

### View Launch File Output

```bash
# Show all launch activity
ros2 launch --debug my_package my_launch.py

# List available launch files
ros2 launch my_package --show-args

# Describe launch arguments
ros2 launch my_package my_launch.py --show-args
```

### Common Issues

**Issue**: "Package not found"
```bash
# Solution: Source workspace
source ~/ros2_ws/install/setup.bash
```

**Issue**: "Launch file not found"
```bash
# Solution: Ensure launch file is in launch/ directory
# and declared in setup.py

# In setup.py:
import os
from glob import glob

setup(
    # ...
    data_files=[
        # ...
        (os.path.join('share', package_name, 'launch'),
         glob('launch/*.py')),
    ],
)
```

---

## Key Takeaways

:::tip Core Concepts
1. **Launch files** start multiple nodes with one command
2. Use **Python** for launch files in ROS 2 (not XML)
3. Set **parameters** inline or from YAML files
4. Use **remapping** to redirect topics
5. **Namespaces** prevent naming conflicts (multi-robot)
6. **Arguments** make launch files configurable
7. **Include** other launch files to compose systems
8. Use **conditions** for optional nodes
:::

---

## Check Your Understanding

1. How do you start two nodes with one command?
2. What's the difference between setting parameters inline vs. from a YAML file?
3. When would you use topic remapping?
4. How do you make a launch file accept arguments?
5. What's the purpose of namespaces in multi-robot systems?

---

## Hands-On Exercise

**Challenge**: Create a launch file for your humanoid robot
- Start `robot_state_publisher` with your URDF
- Start `joint_state_publisher_gui`
- Start RViz with a custom config
- Add arguments for:
  - `use_gui` (whether to show joint state publisher GUI)
  - `rviz_config` (path to RViz config file)
- Load parameters from a YAML file

---

## Next Steps

→ **Next**: [Exercises](./07-exercises.md) - Practice all ROS 2 concepts

Or review:
- [rclpy Basics](./04-rclpy-basics.md)
- [URDF for Humanoids](./05-urdf-humanoids.md)

---

**Reference**: [ROS 2 Launch Documentation](https://docs.ros.org/en/humble/Tutorials/Intermediate/Launch/Launch-Main.html)
