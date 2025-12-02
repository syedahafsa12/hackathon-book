---
sidebar_position: 3
---

# Services & Actions: Request-Response Communication

## When Topics Aren't Enough

Topics are great for continuous data streams, but sometimes you need:
- **Direct communication** with a response
- **Confirmation** that a task completed
- **Feedback** during long-running operations

That's where **services** and **actions** come in.

---

## Services: Synchronous Request-Response

A **service** is like a function call over the network:
- **Client** sends a request
- **Server** processes it and returns a response
- **Synchronous**: Client waits for response (blocks)

### Service Use Cases

| Task | Why Service? |
|------|--------------|
| "Calculate inverse kinematics" | Need joint angles back |
| "What's the battery level?" | Need immediate answer |
| "Save current map" | Need confirmation of success |
| "Reset odometry" | Need acknowledgment |

---

## Creating a Service Server

Let's create a service that adds two integers.

### Step 1: Understand Service Types

Service types have two parts:
- **Request**: Data sent to server
- **Response**: Data returned by server

**Example** (`example_interfaces/srv/AddTwoInts`):
```
# Request
int64 a
int64 b
---
# Response
int64 sum
```

### Step 2: Create the Server Node

Create `~/ros2_ws/src/my_robot_tutorials/my_robot_tutorials/add_two_ints_server.py`:

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts


class AddTwoIntsServer(Node):
    """
    Service server that adds two integers.
    """
    def __init__(self):
        super().__init__('add_two_ints_server')

        # Create a service
        # Arguments: service_type, service_name, callback_function
        self.service = self.create_service(
            AddTwoInts,
            'add_two_ints',
            self.add_two_ints_callback
        )

        self.get_logger().info('Add Two Ints Server is ready')

    def add_two_ints_callback(self, request, response):
        """
        Called when a client sends a request.

        Args:
            request: Contains 'a' and 'b' fields
            response: We fill in the 'sum' field

        Returns:
            response: The modified response object
        """
        # Perform the calculation
        response.sum = request.a + request.b

        # Log the operation
        self.get_logger().info(
            f'Request: {request.a} + {request.b} = {response.sum}'
        )

        # Return the response
        return response


def main(args=None):
    rclpy.init(args=args)
    node = AddTwoIntsServer()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Step 3: Create the Client Node

Create `~/ros2_ws/src/my_robot_tutorials/my_robot_tutorials/add_two_ints_client.py`:

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from example_interfaces.srv import AddTwoInts
import sys


class AddTwoIntsClient(Node):
    """
    Service client that sends addition requests.
    """
    def __init__(self):
        super().__init__('add_two_ints_client')

        # Create a client
        self.client = self.create_client(AddTwoInts, 'add_two_ints')

        # Wait for server to be available
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Waiting for service to be available...')

        self.get_logger().info('Service is available!')

    def send_request(self, a, b):
        """
        Send a request to add two numbers.

        Args:
            a (int): First number
            b (int): Second number

        Returns:
            int: The sum
        """
        # Create a request
        request = AddTwoInts.Request()
        request.a = a
        request.b = b

        # Call the service (blocks until response)
        self.get_logger().info(f'Sending request: {a} + {b}')
        future = self.client.call_async(request)

        # Wait for response
        rclpy.spin_until_future_complete(self, future)

        if future.result() is not None:
            response = future.result()
            self.get_logger().info(f'Result: {response.sum}')
            return response.sum
        else:
            self.get_logger().error('Service call failed')
            return None


def main(args=None):
    rclpy.init(args=args)

    # Get numbers from command line
    if len(sys.argv) < 3:
        print('Usage: ros2 run my_robot_tutorials add_two_ints_client <a> <b>')
        return

    a = int(sys.argv[1])
    b = int(sys.argv[2])

    # Create client and send request
    client = AddTwoIntsClient()
    result = client.send_request(a, b)

    client.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Step 4: Update `setup.py`

```python
entry_points={
    'console_scripts': [
        # ... previous entries ...
        'add_two_ints_server = my_robot_tutorials.add_two_ints_server:main',
        'add_two_ints_client = my_robot_tutorials.add_two_ints_client:main',
    ],
},
```

### Step 5: Build and Test

```bash
cd ~/ros2_ws
colcon build --packages-select my_robot_tutorials
source install/setup.bash

# Terminal 1: Start server
ros2 run my_robot_tutorials add_two_ints_server

# Terminal 2: Call service
ros2 run my_robot_tutorials add_two_ints_client 15 27

# Output: Result: 42
```

---

## Using Services from Command Line

```bash
# List all services
ros2 service list

# Get service type
ros2 service type /add_two_ints

# Call service directly
ros2 service call /add_two_ints example_interfaces/srv/AddTwoInts "{a: 10, b: 20}"

# Response: sum: 30
```

---

## Actions: Long-Running Tasks with Feedback

**Actions** are for tasks that:
- Take time to complete
- Provide progress updates
- Can be canceled mid-execution

### Action Structure

Actions have three parts:
1. **Goal**: What to do
2. **Feedback**: Progress updates
3. **Result**: Final outcome

**Example** (`action_tutorials_interfaces/action/Fibonacci`):
```
# Goal
int32 order
---
# Result
int32[] sequence
---
# Feedback
int32[] partial_sequence
```

---

## Creating an Action Server

Let's create a Fibonacci sequence generator.

### Step 1: Install Action Package

```bash
sudo apt install ros-humble-example-interfaces
sudo apt install ros-humble-action-tutorials-interfaces
```

### Step 2: Create the Action Server

Create `~/ros2_ws/src/my_robot_tutorials/my_robot_tutorials/fibonacci_server.py`:

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from rclpy.action import ActionServer
from action_tutorials_interfaces.action import Fibonacci
import time


class FibonacciActionServer(Node):
    """
    Action server that generates Fibonacci sequences.
    """
    def __init__(self):
        super().__init__('fibonacci_action_server')

        # Create an action server
        self._action_server = ActionServer(
            self,
            Fibonacci,
            'fibonacci',
            self.execute_callback
        )

        self.get_logger().info('Fibonacci Action Server is ready')

    def execute_callback(self, goal_handle):
        """
        Called when a new goal is received.

        Args:
            goal_handle: Handle to track goal status

        Returns:
            result: Final result of the action
        """
        self.get_logger().info('Executing goal...')

        # Get the goal (order of Fibonacci sequence)
        order = goal_handle.request.order

        # Initialize feedback and result
        feedback_msg = Fibonacci.Feedback()
        feedback_msg.partial_sequence = [0, 1]

        # Generate Fibonacci sequence
        for i in range(1, order):
            # Check if goal was canceled
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                return Fibonacci.Result()

            # Calculate next Fibonacci number
            feedback_msg.partial_sequence.append(
                feedback_msg.partial_sequence[i] +
                feedback_msg.partial_sequence[i - 1]
            )

            # Publish feedback
            self.get_logger().info(
                f'Feedback: {feedback_msg.partial_sequence}'
            )
            goal_handle.publish_feedback(feedback_msg)

            # Simulate work
            time.sleep(0.5)

        # Mark goal as succeeded
        goal_handle.succeed()

        # Return final result
        result = Fibonacci.Result()
        result.sequence = feedback_msg.partial_sequence

        self.get_logger().info(f'Goal succeeded! Result: {result.sequence}')

        return result


def main(args=None):
    rclpy.init(args=args)
    node = FibonacciActionServer()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Step 3: Create the Action Client

Create `~/ros2_ws/src/my_robot_tutorials/my_robot_tutorials/fibonacci_client.py`:

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient
from action_tutorials_interfaces.action import Fibonacci


class FibonacciActionClient(Node):
    """
    Action client that requests Fibonacci sequences.
    """
    def __init__(self):
        super().__init__('fibonacci_action_client')

        # Create an action client
        self._action_client = ActionClient(
            self,
            Fibonacci,
            'fibonacci'
        )

    def send_goal(self, order):
        """
        Send a goal to generate Fibonacci sequence.

        Args:
            order (int): How many Fibonacci numbers to generate
        """
        # Wait for action server
        self.get_logger().info('Waiting for action server...')
        self._action_client.wait_for_server()

        # Create goal message
        goal_msg = Fibonacci.Goal()
        goal_msg.order = order

        self.get_logger().info(f'Sending goal: Generate {order} Fibonacci numbers')

        # Send goal asynchronously
        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )

        # Add callback for when goal is accepted/rejected
        self._send_goal_future.add_done_callback(self.goal_response_callback)

    def goal_response_callback(self, future):
        """
        Called when server accepts or rejects goal.
        """
        goal_handle = future.result()

        if not goal_handle.accepted:
            self.get_logger().info('Goal rejected')
            return

        self.get_logger().info('Goal accepted')

        # Get result asynchronously
        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.get_result_callback)

    def feedback_callback(self, feedback_msg):
        """
        Called when feedback is received.
        """
        feedback = feedback_msg.feedback
        self.get_logger().info(
            f'Feedback: {feedback.partial_sequence}'
        )

    def get_result_callback(self, future):
        """
        Called when final result is ready.
        """
        result = future.result().result
        self.get_logger().info(f'Result: {result.sequence}')

        # Shutdown after receiving result
        rclpy.shutdown()


def main(args=None):
    rclpy.init(args=args)

    action_client = FibonacciActionClient()
    action_client.send_goal(10)  # Generate 10 Fibonacci numbers

    rclpy.spin(action_client)


if __name__ == '__main__':
    main()
```

### Step 4: Update `setup.py`

```python
entry_points={
    'console_scripts': [
        # ... previous entries ...
        'fibonacci_server = my_robot_tutorials.fibonacci_server:main',
        'fibonacci_client = my_robot_tutorials.fibonacci_client:main',
    ],
},
```

### Step 5: Update `package.xml`

Add dependency:
```xml
<depend>action_tutorials_interfaces</depend>
```

### Step 6: Build and Test

```bash
cd ~/ros2_ws
colcon build --packages-select my_robot_tutorials
source install/setup.bash

# Terminal 1: Start action server
ros2 run my_robot_tutorials fibonacci_server

# Terminal 2: Send goal
ros2 run my_robot_tutorials fibonacci_client
```

**Expected output**:
- Server logs each Fibonacci number
- Client receives feedback updates
- Both see final result

---

## Using Actions from Command Line

```bash
# List all actions
ros2 action list

# Send goal
ros2 action send_goal /fibonacci action_tutorials_interfaces/action/Fibonacci "{order: 5}"

# Send goal with feedback
ros2 action send_goal /fibonacci action_tutorials_interfaces/action/Fibonacci "{order: 5}" --feedback
```

---

## Service vs. Action: When to Use What?

| Feature | Service | Action |
|---------|---------|--------|
| **Duration** | Quick (&lt;1 second) | Long (seconds to minutes) |
| **Feedback** | No | Yes |
| **Cancellation** | No | Yes |
| **Use case** | Queries, quick commands | Navigation, manipulation |

**Examples**:

**Use Services for**:
- "Get current pose"
- "Calculate inverse kinematics"
- "Switch control mode"

**Use Actions for**:
- "Navigate to point (x, y)"
- "Pick up object"
- "Execute trajectory"

---

## Practical Example: Robot Mode Switcher

A service to switch between robot control modes.

### Create Custom Service

Create `~/ros2_ws/src/my_robot_tutorials/srv/SetMode.srv`:

```
# Request
string mode  # "autonomous", "manual", "idle"
---
# Response
bool success
string message
```

### Update `CMakeLists.txt` (if using C++)

For Python packages, add to `package.xml`:

```xml
<build_depend>rosidl_default_generators</build_depend>
<exec_depend>rosidl_default_runtime</exec_depend>
<member_of_group>rosidl_interface_packages</member_of_group>
```

### Implement the Service

```python
#!/usr/bin/env python3
import rclpy
from rclpy.node import Node
from my_robot_tutorials.srv import SetMode  # Your custom service


class ModeSwitcher(Node):
    def __init__(self):
        super().__init__('mode_switcher')

        self.current_mode = 'idle'

        self.service = self.create_service(
            SetMode,
            'set_mode',
            self.set_mode_callback
        )

        self.get_logger().info(f'Mode Switcher ready. Current mode: {self.current_mode}')

    def set_mode_callback(self, request, response):
        """
        Switch robot control mode.
        """
        valid_modes = ['autonomous', 'manual', 'idle']

        if request.mode in valid_modes:
            old_mode = self.current_mode
            self.current_mode = request.mode

            response.success = True
            response.message = f'Switched from {old_mode} to {self.current_mode}'

            self.get_logger().info(response.message)
        else:
            response.success = False
            response.message = f'Invalid mode: {request.mode}. Valid: {valid_modes}'

            self.get_logger().warn(response.message)

        return response


def main(args=None):
    rclpy.init(args=args)
    node = ModeSwitcher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

---

## Key Takeaways

:::tip Core Concepts
1. **Services** = synchronous request-response (client blocks)
2. **Actions** = long-running tasks with feedback and cancellation
3. Services have **Request** and **Response** parts
4. Actions have **Goal**, **Feedback**, and **Result** parts
5. Use services for quick queries, actions for tasks that take time
6. Always wait for server/action availability before calling
7. Actions can be canceled mid-execution
:::

---

## Check Your Understanding

1. What's the difference between a service and an action?
2. When would you use a service instead of a topic?
3. What are the three parts of an action?
4. Can you cancel a service call mid-execution?
5. What happens if a service client calls a non-existent service?

---

## Hands-On Exercise

**Challenge**: Create a "Battery Charger" action server
- **Goal**: Target charge level (e.g., 80%)
- **Feedback**: Current charge level (increase by 10% every second)
- **Result**: Final charge level
- Should handle cancellation (stop charging)

**Bonus**: Add a service to query current battery level without charging.

---

## Next Steps

→ **Next**: [rclpy Basics](./04-rclpy-basics.md) - Deep dive into ROS 2 Python

Or explore:
- [URDF for Humanoids](./05-urdf-humanoids.md) - Robot description
- [Launch Files](./06-launch-files.md) - Start multiple nodes at once

---

**Need help?** Check the [ROS 2 Services Tutorial](https://docs.ros.org/en/humble/Tutorials/Services/Understanding-ROS2-Services.html) or use the AI chatbot!
