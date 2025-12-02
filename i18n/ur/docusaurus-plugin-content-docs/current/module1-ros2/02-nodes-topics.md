---
sidebar_position: 2
---

# Nodes اور Topics: Building Communication

## Understanding the Publish-Subscribe Pattern

The **publish-subscribe pattern** is the backbone of ROS 2 communication. It's like a radio broadcast:
- **Publishers** are radio stations broadcasting on specific frequencies
- **Subscribers** tune in to frequencies they care about
- Multiple subscribers can listen to the same broadcaster
- Broadcasters don't know (or care) who's listening

This **decoupling** is powerful: you can add/remove subscribers without changing the publisher.

---

## Your First Publisher Node

Let's create a simple publisher that sends string messages.

### Step 1: Create a Package

```bash
cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python my_robot_tutorials \
  --dependencies rclpy std_msgs
```

**What this does**:
- Creates a Python package named `my_robot_tutorials`
- Adds dependencies: `rclpy` (ROS 2 Python client library) and `std_msgs` (standard message types)

### Step 2: Write the Publisher Node

Create `~/ros2_ws/src/my_robot_tutorials/my_robot_tutorials/simple_publisher.py`:

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class SimplePublisher(Node):
    """
    A simple publisher node that sends string messages.
    """
    def __init__(self):
        # Initialize the node with a name
        super().__init__('simple_publisher')

        # Create a publisher
        # Arguments: message_type, topic_name, queue_size
        self.publisher_ = self.create_publisher(String, 'chatter', 10)

        # Create a timer that calls timer_callback every 0.5 seconds
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)

        # Counter to track messages
        self.counter = 0

        self.get_logger().info('Simple Publisher has been started')

    def timer_callback(self):
        """
        Called periodically by the timer.
        Publishes a message to the 'chatter' topic.
        """
        # Create a message
        msg = String()
        msg.data = f'Hello ROS 2! Message #{self.counter}'

        # Publish the message
        self.publisher_.publish(msg)

        # Log to terminal
        self.get_logger().info(f'Publishing: "{msg.data}"')

        # Increment counter
        self.counter += 1


def main(args=None):
    # Initialize the ROS 2 Python client library
    rclpy.init(args=args)

    # Create the node
    node = SimplePublisher()

    # Keep the node running (spin)
    # This allows callbacks to be executed
    rclpy.spin(node)

    # Cleanup (called when Ctrl+C is pressed)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Step 3: Update `setup.py`

Edit `~/ros2_ws/src/my_robot_tutorials/setup.py`:

```python
from setuptools import setup

package_name = 'my_robot_tutorials'

setup(
    name=package_name,
    version='0.0.1',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Your Name',
    maintainer_email='you@example.com',
    description='ROS 2 tutorial package',
    license='Apache License 2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            'simple_publisher = my_robot_tutorials.simple_publisher:main',
        ],
    },
)
```

**Key addition**: The `entry_points` section registers the node as a command-line executable.

### Step 4: Build and Run

```bash
cd ~/ros2_ws
colcon build --packages-select my_robot_tutorials
source install/setup.bash

# Run the publisher
ros2 run my_robot_tutorials simple_publisher
```

**Expected output**:
```
[INFO] [simple_publisher]: Simple Publisher has been started
[INFO] [simple_publisher]: Publishing: "Hello ROS 2! Message #0"
[INFO] [simple_publisher]: Publishing: "Hello ROS 2! Message #1"
[INFO] [simple_publisher]: Publishing: "Hello ROS 2! Message #2"
...
```

---

## Your First Subscriber Node

Now let's create a subscriber to receive those messages.

### Create the Subscriber

Create `~/ros2_ws/src/my_robot_tutorials/my_robot_tutorials/simple_subscriber.py`:

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class SimpleSubscriber(Node):
    """
    A simple subscriber node that listens to string messages.
    """
    def __init__(self):
        super().__init__('simple_subscriber')

        # Create a subscription
        # Arguments: message_type, topic_name, callback_function, queue_size
        self.subscription = self.create_subscription(
            String,
            'chatter',
            self.listener_callback,
            10
        )

        self.get_logger().info('Simple Subscriber has been started')

    def listener_callback(self, msg):
        """
        Called whenever a message is received on the 'chatter' topic.
        """
        self.get_logger().info(f'I heard: "{msg.data}"')


def main(args=None):
    rclpy.init(args=args)
    node = SimpleSubscriber()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Update `setup.py`

Add the subscriber entry point:

```python
entry_points={
    'console_scripts': [
        'simple_publisher = my_robot_tutorials.simple_publisher:main',
        'simple_subscriber = my_robot_tutorials.simple_subscriber:main',
    ],
},
```

### Build and Test

```bash
cd ~/ros2_ws
colcon build --packages-select my_robot_tutorials
source install/setup.bash

# Terminal 1: Run publisher
ros2 run my_robot_tutorials simple_publisher

# Terminal 2: Run subscriber
ros2 run my_robot_tutorials simple_subscriber
```

**You should see**:
- Terminal 1: Publishing messages
- Terminal 2: Receiving and logging those messages

---

## Inspecting Topics

While your nodes are running, open a new terminal:

```bash
# List all topics
ros2 topic list

# Output:
# /chatter
# /parameter_events
# /rosout

# Get info about a topic
ros2 topic info /chatter

# Output:
# Type: std_msgs/msg/String
# Publisher count: 1
# Subscription count: 1

# Echo messages (see live data)
ros2 topic echo /chatter

# Measure publishing frequency
ros2 topic hz /chatter

# Output:
# average rate: 2.000
#   min: 0.500s max: 0.500s std dev: 0.000s window: 10
```

---

## Understanding Message Types

ROS 2 uses **strongly-typed messages**. Common message packages:

### std_msgs (Standard Messages)

```python
from std_msgs.msg import String, Int32, Float64, Bool

# String message
msg = String()
msg.data = "Hello"

# Int32 message
msg = Int32()
msg.data = 42

# Float64 message
msg = Float64()
msg.data = 3.14

# Bool message
msg = Bool()
msg.data = True
```

### geometry_msgs (Geometry Messages)

Used for positions, velocities, transforms:

```python
from geometry_msgs.msg import Twist, Point, Pose

# Twist (linear + angular velocity)
cmd_vel = Twist()
cmd_vel.linear.x = 0.5   # Move forward at 0.5 m/s
cmd_vel.angular.z = 0.1  # Turn at 0.1 rad/s

# Point (x, y, z coordinates)
point = Point()
point.x = 1.0
point.y = 2.0
point.z = 0.0

# Pose (position + orientation)
pose = Pose()
pose.position.x = 1.0
pose.position.y = 2.0
pose.orientation.w = 1.0  # Quaternion (no rotation)
```

### sensor_msgs (Sensor Messages)

```python
from sensor_msgs.msg import Image, LaserScan, Imu, JointState

# Image
image = Image()
image.height = 480
image.width = 640
image.encoding = "rgb8"
image.data = [...]  # Raw pixel data

# LaserScan (LiDAR data)
scan = LaserScan()
scan.ranges = [1.0, 1.2, 1.5, ...]  # Distance measurements

# JointState (robot joint positions)
joint_state = JointState()
joint_state.name = ['joint1', 'joint2']
joint_state.position = [0.0, 1.57]  # Radians
```

---

## Practical Example: Robot Velocity Controller

Let's create a node that publishes velocity commands (used by mobile robots and humanoids).

### Velocity Publisher

Create `~/ros2_ws/src/my_robot_tutorials/my_robot_tutorials/velocity_publisher.py`:

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import math


class VelocityPublisher(Node):
    """
    Publishes velocity commands in a circular pattern.
    """
    def __init__(self):
        super().__init__('velocity_publisher')

        # Publisher for velocity commands
        self.publisher_ = self.create_publisher(Twist, 'cmd_vel', 10)

        # Timer to publish at 10 Hz
        self.timer = self.create_timer(0.1, self.timer_callback)

        # Time counter
        self.time = 0.0

        self.get_logger().info('Velocity Publisher started')

    def timer_callback(self):
        """
        Publishes velocity commands that create a circular motion.
        """
        msg = Twist()

        # Sinusoidal linear velocity
        msg.linear.x = 0.5 + 0.2 * math.sin(self.time)
        msg.linear.y = 0.0
        msg.linear.z = 0.0

        # Constant angular velocity
        msg.angular.x = 0.0
        msg.angular.y = 0.0
        msg.angular.z = 0.3  # Rotate at 0.3 rad/s

        self.publisher_.publish(msg)

        self.get_logger().info(
            f'Linear: {msg.linear.x:.2f}, Angular: {msg.angular.z:.2f}'
        )

        self.time += 0.1


def main(args=None):
    rclpy.init(args=args)
    node = VelocityPublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Test with Turtlesim

```bash
# Terminal 1: Start turtlesim
ros2 run turtlesim turtlesim_node

# Terminal 2: Run your velocity publisher
# (after building and sourcing)
ros2 run my_robot_tutorials velocity_publisher
```

The turtle should move in a circular pattern!

---

## Quality of Service (QoS)

QoS profiles control the reliability and behavior of topic communication.

### Common QoS Profiles

```python
from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy

# Sensor data: best effort, volatile
sensor_qos = QoSProfile(
    reliability=ReliabilityPolicy.BEST_EFFORT,
    durability=DurabilityPolicy.VOLATILE,
    depth=10
)

# Commands: reliable, transient local
command_qos = QoSProfile(
    reliability=ReliabilityPolicy.RELIABLE,
    durability=DurabilityPolicy.TRANSIENT_LOCAL,
    depth=10
)

# Use in publisher
self.publisher_ = self.create_publisher(
    String,
    'topic_name',
    qos_profile=sensor_qos
)
```

**Key concepts**:
- **Reliable**: Guarantees delivery (like TCP)
- **Best Effort**: Fire and forget (like UDP), faster but may lose messages
- **Transient Local**: New subscribers get the last N messages
- **Volatile**: No history, only current messages

**When to use what**:
- **Sensor data** (camera, LiDAR): Best effort (high frequency, ok to drop frames)
- **Control commands**: Reliable (must not lose commands)
- **Robot state**: Transient local (new nodes should get current state)

---

## Multiple Publishers/Subscribers

A topic can have multiple publishers and/or subscribers:

```
Publisher A ──┐
              ├─▶ Topic: /sensor/data ─┬─▶ Subscriber 1
Publisher B ──┘                        ├─▶ Subscriber 2
                                       └─▶ Subscriber 3
```

**Use case**: Multiple cameras publishing to different topics, one node subscribing to all.

---

## Best Practices

### 1. Use Descriptive Topic Names

```python
# Bad
self.create_publisher(String, 'data', 10)

# Good
self.create_publisher(Image, '/camera/front/image_raw', 10)
```

**Naming convention**:
- Use lowercase with underscores
- Organize hierarchically: `/namespace/device/data_type`
- Absolute paths start with `/`, relative paths don't

### 2. Choose Appropriate Queue Sizes

```python
# For slow subscribers, larger queue
self.create_publisher(Image, '/camera/image', queue_size=50)

# For fast processing, smaller queue
self.create_publisher(String, '/status', queue_size=5)
```

**Rule of thumb**:
- High-frequency sensors: 10-50
- Commands: 5-10
- State updates: 1-5

### 3. Log Important Events

```python
self.get_logger().info('Node started')
self.get_logger().warn('Battery low!')
self.get_logger().error('Sensor disconnected!')
```

### 4. Handle Cleanup

```python
def __del__(self):
    self.get_logger().info('Shutting down cleanly')
```

---

## Common Pitfalls

### Pitfall 1: Forgetting to Source Workspace

```bash
# After building, you MUST source
source ~/ros2_ws/install/setup.bash

# Or add to ~/.bashrc
echo "source ~/ros2_ws/install/setup.bash" >> ~/.bashrc
```

### Pitfall 2: Mismatched Message Types

```python
# Publisher sends String
self.create_publisher(String, 'topic', 10)

# Subscriber expects Int32 (WILL NOT WORK!)
self.create_subscription(Int32, 'topic', callback, 10)
```

**Fix**: Ensure publisher and subscriber use the same message type.

### Pitfall 3: Not Calling `spin()`

```python
# Wrong: node exits immediately
def main():
    rclpy.init()
    node = SimplePublisher()
    # Missing rclpy.spin(node)!
    rclpy.shutdown()

# Correct: node stays alive
def main():
    rclpy.init()
    node = SimplePublisher()
    rclpy.spin(node)  # Blocks here until Ctrl+C
    rclpy.shutdown()
```

---

## Key Takeaways

:::tip Core Concepts
1. **Topics** implement the **publish-subscribe pattern**
2. **Publishers** send messages; **subscribers** receive them
3. **Message types** must match between publisher and subscriber
4. Use `ros2 topic` commands to inspect and debug topics
5. **QoS profiles** control reliability (best effort vs. reliable)
6. Always call `rclpy.spin()` to keep your node running
7. Use descriptive topic names and appropriate queue sizes
:::

---

## Check Your Understanding

1. What's the difference between a publisher and a subscriber?
2. Can a topic have multiple subscribers? Multiple publishers?
3. What does `rclpy.spin()` do?
4. What happens if a publisher and subscriber use different message types on the same topic?
5. When would you use `BEST_EFFORT` vs. `RELIABLE` QoS?

---

## Hands-On Exercise

**Challenge**: Create a "Robot Status Monitor"
- **Publisher node**: Publishes fake sensor data (temperature, battery level) every second
- **Subscriber node**: Listens and logs warnings if temperature > 80°C or battery < 20%

**Hint**: Use `Float64` from `std_msgs` for numeric data.

---

## Next Steps

→ **Next**: [Services & Actions](./03-services-actions.md) - Request-response communication

Or explore:
- [rclpy Basics](./04-rclpy-basics.md) - Deep dive into the Python client library
- [URDF for Humanoids](./05-urdf-humanoids.md) - Robot description format

---

**Need help?** Check the [ROS 2 Topics Tutorial](https://docs.ros.org/en/humble/Tutorials/Topics/Understanding-ROS2-Topics.html) or ask the AI chatbot!


---

**نوٹ**: یہ صفحہ اردو میں دستیاب ہے۔ مکمل ترجمہ جلد شامل کیا جائے گا۔

