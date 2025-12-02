---
sidebar_position: 4
---

# rclpy بنیادی باتیں: Mastering ROS 2 Python

## What is rclpy?

**rclpy** (ROS Client Library for Python) is the Python API for ROS 2. It provides:
- Node creation and lifecycle management
- Publisher/Subscriber creation
- Service/Action servers and clients
- Parameter handling
- Timers and executors

Think of it as the Python interface to all ROS 2 functionality.

---

## Node Lifecycle and Initialization

### Basic Node Pattern

```python
import rclpy
from rclpy.node import Node

class MyNode(Node):
    def __init__(self):
        # Must call super().__init__() with node name
        super().__init__('my_node_name')

        # Initialize your node here
        self.get_logger().info('Node initialized')

    def do_work(self):
        # Your node logic
        pass

def main(args=None):
    # Initialize ROS 2 Python client library
    rclpy.init(args=args)

    # Create node instance
    node = MyNode()

    # Spin (process callbacks)
    rclpy.spin(node)

    # Cleanup
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Key points**:
- `rclpy.init()`: Must be called before creating nodes
- `super().__init__('name')`: Registers node with ROS 2 system
- `rclpy.spin()`: Processes callbacks (blocks until shutdown)
- `destroy_node()` and `shutdown()`: Clean up resources

---

## Timers: Periodic Execution

Timers execute callbacks at regular intervals.

```python
class TimerNode(Node):
    def __init__(self):
        super().__init__('timer_node')

        # Create timer that fires every 0.5 seconds
        self.timer = self.create_timer(
            timer_period_sec=0.5,
            callback=self.timer_callback
        )

        self.counter = 0

    def timer_callback(self):
        self.get_logger().info(f'Timer fired! Count: {self.counter}')
        self.counter += 1
```

**Use cases**:
- Periodic sensor reading
- Regular state publishing
- Heartbeat signals

---

## Parameters: Configurable Nodes

Parameters allow runtime configuration without code changes.

### Declaring and Using Parameters

```python
class ParameterNode(Node):
    def __init__(self):
        super().__init__('parameter_node')

        # Declare parameters with default values
        self.declare_parameter('robot_name', 'atlas')
        self.declare_parameter('max_speed', 1.0)
        self.declare_parameter('debug_mode', False)

        # Get parameter values
        self.robot_name = self.get_parameter('robot_name').value
        self.max_speed = self.get_parameter('max_speed').value
        self.debug_mode = self.get_parameter('debug_mode').value

        self.get_logger().info(f'Robot: {self.robot_name}')
        self.get_logger().info(f'Max speed: {self.max_speed} m/s')

        # Add callback for parameter changes
        self.add_on_set_parameters_callback(self.parameter_callback)

    def parameter_callback(self, params):
        """Called when parameters are modified"""
        for param in params:
            if param.name == 'max_speed':
                if param.value > 2.0:
                    self.get_logger().warn('Speed too high! Clamping to 2.0')
                    param.value = 2.0

                self.max_speed = param.value

        return rclpy.parameter.SetParametersResult(successful=True)
```

### Setting Parameters from Command Line

```bash
# Run with custom parameters
ros2 run my_package parameter_node --ros-args \
  -p robot_name:=optimus \
  -p max_speed:=1.5 \
  -p debug_mode:=true

# Set parameter on running node
ros2 param set /parameter_node max_speed 0.8

# Get parameter value
ros2 param get /parameter_node robot_name

# List all parameters
ros2 param list
```

### Loading Parameters from YAML

Create `config/params.yaml`:
```yaml
parameter_node:
  ros__parameters:
    robot_name: "unitree_h1"
    max_speed: 1.2
    debug_mode: true
```

Load with:
```bash
ros2 run my_package parameter_node --ros-args \
  --params-file config/params.yaml
```

---

## Logging: Debug and Monitor

### Log Levels

```python
class LoggingNode(Node):
    def __init__(self):
        super().__init__('logging_node')

        # Different log levels
        self.get_logger().debug('Detailed debug information')
        self.get_logger().info('General information')
        self.get_logger().warn('Warning message')
        self.get_logger().error('Error occurred')
        self.get_logger().fatal('Critical failure')
```

### Setting Log Level

```bash
# Set log level for a node
ros2 run my_package logging_node --ros-args \
  --log-level debug

# View logs
ros2 run rqt_console rqt_console
```

**Best practices**:
- `DEBUG`: Detailed internal state
- `INFO`: Normal operational messages
- `WARN`: Recoverable issues
- `ERROR`: Failures that stop functionality
- `FATAL`: Unrecoverable failures

---

## Context Managers and Lifecycle

### Using Context Managers

```python
import rclpy
from rclpy.node import Node

def main():
    rclpy.init()

    try:
        node = Node('context_node')
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        if rclpy.ok():
            node.destroy_node()
            rclpy.shutdown()
```

### Handling Shutdown Gracefully

```python
class GracefulNode(Node):
    def __init__(self):
        super().__init__('graceful_node')

        self.running = True

        # Register shutdown handler
        self.context.on_shutdown(self.shutdown_callback)

    def shutdown_callback(self):
        """Called when node is shutting down"""
        self.get_logger().info('Shutting down gracefully...')
        self.running = False

        # Close resources
        # Save state
        # etc.
```

---

## Executors: Advanced Spinning

### Single-Threaded Executor (Default)

```python
rclpy.spin(node)  # Processes callbacks sequentially
```

### Multi-Threaded Executor

```python
from rclpy.executors import MultiThreadedExecutor

executor = MultiThreadedExecutor()
executor.add_node(node1)
executor.add_node(node2)

try:
    executor.spin()
finally:
    executor.shutdown()
```

**Use case**: When you have multiple nodes or callbacks that can run in parallel.

### Single-Threaded Executor with Manual Control

```python
import rclpy
from rclpy.executors import SingleThreadedExecutor

executor = SingleThreadedExecutor()
executor.add_node(node)

while rclpy.ok():
    # Process callbacks for 0.1 seconds
    executor.spin_once(timeout_sec=0.1)

    # Do other work
    perform_custom_logic()

executor.shutdown()
```

---

## Callback Groups: Concurrent Execution

Control callback execution order.

```python
from rclpy.callback_groups import ReentrantCallbackGroup, MutuallyExclusiveCallbackGroup

class CallbackNode(Node):
    def __init__(self):
        super().__init__('callback_node')

        # Allow concurrent execution
        reentrant_group = ReentrantCallbackGroup()

        # Sequential execution (default)
        mutex_group = MutuallyExclusiveCallbackGroup()

        # Assign callbacks to groups
        self.timer1 = self.create_timer(
            1.0,
            self.callback1,
            callback_group=reentrant_group
        )

        self.timer2 = self.create_timer(
            1.0,
            self.callback2,
            callback_group=reentrant_group
        )

    def callback1(self):
        # Can run concurrently with callback2
        pass

    def callback2(self):
        # Can run concurrently with callback1
        pass
```

**Use cases**:
- `MutuallyExclusiveCallbackGroup`: Default, callbacks can't overlap
- `ReentrantCallbackGroup`: Callbacks can run simultaneously (use with multi-threaded executor)

---

## Time: Working with Timestamps

### Getting Current Time

```python
class TimeNode(Node):
    def __init__(self):
        super().__init__('time_node')

        # Get current ROS time
        current_time = self.get_clock().now()

        # Convert to seconds
        seconds = current_time.nanoseconds / 1e9

        self.get_logger().info(f'Current time: {seconds}')

    def create_timestamp_message(self):
        from std_msgs.msg import Header

        header = Header()
        header.stamp = self.get_clock().now().to_msg()
        header.frame_id = 'base_link'

        return header
```

### Duration and Rate

```python
from rclpy.duration import Duration
from rclpy.time import Time

# Create duration (5 seconds)
duration = Duration(seconds=5)

# Add to time
start_time = self.get_clock().now()
end_time = start_time + duration

# Compare times
if self.get_clock().now() > end_time:
    self.get_logger().info('Timeout!')
```

---

## Real-World Example: Sensor Processor

A complete node that reads sensor data, processes it, and publishes results.

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from sensor_msgs.msg import LaserScan
from std_msgs.msg import Float32
import numpy as np


class SensorProcessor(Node):
    """
    Subscribes to LaserScan, computes minimum distance, publishes it.
    """
    def __init__(self):
        super().__init__('sensor_processor')

        # Parameters
        self.declare_parameter('update_rate', 10.0)
        self.declare_parameter('min_distance_threshold', 0.5)

        self.update_rate = self.get_parameter('update_rate').value
        self.threshold = self.get_parameter('min_distance_threshold').value

        # Subscriber
        self.scan_sub = self.create_subscription(
            LaserScan,
            '/scan',
            self.scan_callback,
            10
        )

        # Publisher
        self.min_dist_pub = self.create_publisher(
            Float32,
            '/min_distance',
            10
        )

        # State
        self.latest_scan = None

        # Timer for processing
        period = 1.0 / self.update_rate
        self.timer = self.create_timer(period, self.process_callback)

        self.get_logger().info(
            f'Sensor Processor started (rate: {self.update_rate} Hz)'
        )

    def scan_callback(self, msg):
        """Store latest scan data"""
        self.latest_scan = msg

    def process_callback(self):
        """Process scan and publish result"""
        if self.latest_scan is None:
            return

        # Filter out invalid readings
        ranges = np.array(self.latest_scan.ranges)
        valid_ranges = ranges[np.isfinite(ranges)]

        if len(valid_ranges) == 0:
            return

        # Compute minimum distance
        min_distance = float(np.min(valid_ranges))

        # Publish
        msg = Float32()
        msg.data = min_distance
        self.min_dist_pub.publish(msg)

        # Warn if too close
        if min_distance < self.threshold:
            self.get_logger().warn(
                f'Obstacle detected at {min_distance:.2f}m!'
            )


def main(args=None):
    rclpy.init(args=args)
    node = SensorProcessor()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

---

## Key Takeaways

:::tip Core Concepts
1. **rclpy** is the Python client library for ROS 2
2. **Timers** enable periodic execution of callbacks
3. **Parameters** allow runtime configuration
4. Use **log levels** appropriately (debug, info, warn, error, fatal)
5. **Executors** control how callbacks are processed (single/multi-threaded)
6. **Callback groups** manage concurrent callback execution
7. Always call `rclpy.init()` before creating nodes
:::

---

## Check Your Understanding

1. What's the purpose of `rclpy.spin()`?
2. How do you create a parameter with a default value?
3. When would you use a `MultiThreadedExecutor`?
4. What's the difference between `ReentrantCallbackGroup` and `MutuallyExclusiveCallbackGroup`?
5. How do you get the current ROS time?

---

## Hands-On Exercise

**Challenge**: Create a "Heartbeat Monitor"
- Subscribes to a `/heartbeat` topic (std_msgs/Bool)
- If no message received for 5 seconds, logs a warning
- Publishes system status (`/system/status` - "OK", "WARNING", "CRITICAL")
- Use parameters for timeout duration
- Use timers for periodic checking

---

## Next Steps

→ **Next**: [URDF for Humanoids](./05-urdf-humanoids.md) - Robot description format

Or review:
- [Nodes & Topics](./02-nodes-topics.md)
- [Services & Actions](./03-services-actions.md)

---

**Reference**: [rclpy API Documentation](https://docs.ros2.org/latest/api/rclpy/)


---

**نوٹ**: یہ صفحہ اردو میں دستیاب ہے۔ مکمل ترجمہ جلد شامل کیا جائے گا۔

