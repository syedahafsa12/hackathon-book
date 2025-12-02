---
sidebar_position: 4
---

# Prerequisites (ضروری چیزیں) & Setup Guide

## What You Need to Succeed

This course sits at the intersection of AI, robotics, and systems programming. To get the most out of it, you'll need a solid foundation in several areas—and the right development environment.

This chapter helps you assess your readiness and set up your workstation.

## Knowledge Prerequisites

### ✅ Required Skills

#### 1. Python Programming (Intermediate Level)

You should be comfortable with:

```python
# Object-oriented programming
class Robot:
    def __init__(self, name):
        self.name = name
        self.position = [0, 0, 0]

    def move(self, direction, distance):
        # Update position based on direction
        pass

# Async/await (for ROS 2 async operations)
import asyncio

async def sensor_reader():
    while True:
        data = await read_sensor()
        process(data)
        await asyncio.sleep(0.1)

# List comprehensions and functional programming
waypoints = [(x, y) for x in range(10) for y in range(10) if is_valid(x, y)]

filtered_data = list(filter(lambda x: x > threshold, sensor_data))
```

**Not required but helpful**: Decorators, context managers, type hints

**Resources if you need to level up**:
- [Real Python](https://realpython.com/) - Intermediate Python tutorials
- [Python Asyncio Documentation](https://docs.python.org/3/library/asyncio.html)

#### 2. Linux Command Line (Ubuntu)

You should know how to:

```bash
# Navigate filesystem
cd ~/ros2_ws/src
ls -la
pwd

# Manage packages
sudo apt update
sudo apt install ros-humble-desktop

# Process management
ps aux | grep python
kill -9 <PID>

# Environment variables
export ROS_DOMAIN_ID=42
echo $ROS_DOMAIN_ID

# File permissions
chmod +x script.sh
sudo chown $USER:$USER file.txt

# Networking basics
ifconfig
ping 192.168.1.10
netstat -tulpn
```

**Resources**:
- [The Linux Command Line](http://linuxcommand.org/tlcl.php) - Free ebook
- [Ubuntu Server Guide](https://ubuntu.com/server/docs)

#### 3. Git Version Control

Essential commands:

```bash
# Clone repository
git clone https://github.com/user/repo.git

# Basic workflow
git status
git add .
git commit -m "Add URDF model for humanoid"
git push origin main

# Branching
git checkout -b feature/new-controller
git merge main

# Pulling updates
git pull origin main
```

**Resources**:
- [Pro Git Book](https://git-scm.com/book/en/v2) - Free, comprehensive

#### 4. Mathematics

**Linear Algebra** (Critical):
- Vectors and vector operations
- Matrices and matrix multiplication
- Transformations (rotation, translation)
- Homogeneous coordinates

```python
# You should understand what this represents:
import numpy as np

# Rotation matrix (90° around Z-axis)
R_z = np.array([
    [0, -1, 0],
    [1,  0, 0],
    [0,  0, 1]
])

# Apply rotation to point
point = np.array([1, 0, 0])
rotated_point = R_z @ point  # Result: [0, 1, 0]
```

**Calculus** (Helpful):
- Derivatives (for velocity/acceleration)
- Gradients (for optimization)
- Basic differential equations

**Probability** (Helpful):
- Basic probability distributions
- Bayes' theorem
- Gaussian distributions (for sensor noise)

**Resources**:
- [3Blue1Brown - Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)
- [Khan Academy - Linear Algebra](https://www.khanacademy.org/math/linear-algebra)

#### 5. AI/ML Basics

You should understand:
- **Neural networks**: Layers, forward/backprop, training
- **Supervised learning**: Classification, regression
- **Reinforcement learning** (helpful): Agent, environment, reward, policy

**Not required**: You don't need to implement neural networks from scratch, but you should understand the concepts.

**Resources**:
- [fast.ai Practical Deep Learning](https://course.fast.ai/)
- [OpenAI Spinning Up in Deep RL](https://spinningup.openai.com/)

---

### ⚠️ Not Required (But Nice to Have)

- C++ (ROS 2 supports Python, C++ is optional)
- ROS 1 experience (we teach ROS 2 from scratch)
- Prior robotics experience

---

## Hardware Requirements

### Option 1: Local Workstation (Recommended)

For running NVIDIA Isaac Sim, Gazebo, and training models locally.

#### Minimum Specifications

| Component | Minimum | Recommended | Why? |
|-----------|---------|-------------|------|
| **GPU** | RTX 3070 (8GB VRAM) | RTX 4080 (16GB VRAM) | Isaac Sim requires RTX, VRAM for scene rendering |
| **CPU** | Intel i7 12th gen | Intel i9 13th gen / Ryzen 9 | Physics simulation is CPU-intensive |
| **RAM** | 32GB DDR4 | 64GB DDR5 | Large simulation scenes, multiple processes |
| **Storage** | 256GB NVMe SSD | 1TB NVMe SSD | Isaac Sim alone is ~50GB |
| **OS** | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS | ROS 2 Humble native support |

:::warning GPU Requirement
NVIDIA Isaac Sim **requires** an RTX-series GPU (RTX 2000 or newer). AMD GPUs and integrated graphics will NOT work. If you don't have an RTX GPU, use Option 2 (Cloud).
:::

#### Why These Specs?

**VRAM (Video Memory)**:
- Isaac Sim scene with humanoid + environment: ~6-8GB
- Training vision models simultaneously: +2-4GB
- Safety margin for multiple apps: +2GB
- **Minimum 12GB** recommended

**RAM**:
- Ubuntu: ~2GB
- Isaac Sim: ~8-12GB
- ROS 2 nodes: ~2-4GB
- IDE (VSCode): ~1-2GB
- Browser (docs): ~2GB
- **32GB is workable, 64GB is comfortable**

**Storage**:
- Ubuntu: ~10GB
- ROS 2 + dependencies: ~5GB
- NVIDIA Isaac Sim: ~50GB
- Omniverse dependencies: ~20GB
- Gazebo worlds: ~5GB
- Your project files: ~10GB
- **Minimum 100GB free, 256GB total**

---

### Option 2: Cloud Workstation (Alternative)

If you don't have local hardware, use cloud GPU instances.

#### AWS EC2 Recommendations

| Instance Type | GPU | VRAM | vCPU | RAM | Cost (On-Demand) |
|---------------|-----|------|------|-----|------------------|
| `g5.xlarge` | A10G | 24GB | 4 | 16GB | ~$1.00/hour |
| `g5.2xlarge` | A10G | 24GB | 8 | 32GB | ~$1.50/hour |
| `g5.4xlarge` | A10G | 24GB | 16 | 64GB | ~$2.50/hour |

**Cost Estimate** (3 months, 10 hours/week):
- 13 weeks × 10 hours = 130 hours
- 130 hours × $1.50 = **~$195 total**

**Spot Instances**: Save 60-70% using spot instances (subject to interruption)

#### Alternative Cloud Providers

- **Google Cloud** (GCP): Similar g2 instances with NVIDIA L4 GPUs
- **Azure**: NC-series with T4/A100 GPUs
- **Lambda Labs**: Cheaper GPU instances ($0.50-$1.00/hour)
- **Paperspace**: Developer-friendly, persistent storage

**Setup Guide** (See Module 6 for details):
1. Launch Ubuntu 22.04 instance with RTX/A10G GPU
2. Install NVIDIA drivers and Docker
3. Install Isaac Sim via Omniverse
4. SSH tunnel for GUI access

---

### Option 3: Hybrid Approach (Best Value)

**Simulation**: Cloud instances (AWS, Lambda Labs)
**Development**: Local laptop/desktop
**Physical Deployment** (optional): Jetson Orin Nano

This separates compute-heavy simulation from lightweight development.

---

## Software Setup Guide

### Step 1: Install Ubuntu 22.04 LTS

#### On Bare Metal (Recommended)

1. Download [Ubuntu 22.04 Desktop](https://ubuntu.com/download/desktop)
2. Create bootable USB with [Rufus](https://rufus.ie/) (Windows) or `dd` (Linux/Mac)
3. Boot from USB, follow installation wizard
4. **Dual-boot option**: Keep Windows if needed

#### Via VM (Not Recommended for Isaac Sim)

Virtual machines can't access GPU properly. Only use for initial ROS 2 learning (Modules 0-1).

**VirtualBox** or **VMware** with Ubuntu 22.04 guest.

---

### Step 2: Install NVIDIA Drivers

```bash
# Check if you have NVIDIA GPU
lspci | grep -i nvidia

# Update package list
sudo apt update

# Install proprietary NVIDIA driver
sudo ubuntu-drivers autoinstall

# Reboot
sudo reboot

# Verify installation
nvidia-smi
```

Expected output:
```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 525.xx.xx    Driver Version: 525.xx.xx    CUDA Version: 12.0   |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce RTX 4070 Ti   Off  | 00000000:01:00.0  On |                  N/A |
...
```

---

### Step 3: Install ROS 2 Humble

```bash
# Add ROS 2 repository
sudo apt install software-properties-common
sudo add-apt-repository universe

# Add ROS 2 GPG key
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg

# Add repository to sources list
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

# Install ROS 2 Humble Desktop (includes GUI tools)
sudo apt update
sudo apt install ros-humble-desktop

# Install development tools
sudo apt install ros-dev-tools

# Source ROS 2 setup (add to ~/.bashrc for persistence)
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
source ~/.bashrc

# Verify installation
ros2 --version
```

Expected: `ros2 cli version 0.18.x`

---

### Step 4: Install NVIDIA Isaac Sim

:::info Isaac Sim Requires Omniverse
Isaac Sim is part of NVIDIA Omniverse platform. You'll install Omniverse Launcher first.
:::

```bash
# Download Omniverse Launcher
# Visit: https://www.nvidia.com/en-us/omniverse/download/
# Download the .AppImage file for Linux

# Make it executable
chmod +x omniverse-launcher-linux.AppImage

# Run the launcher
./omniverse-launcher-linux.AppImage

# Inside Omniverse Launcher:
# 1. Navigate to "Exchange" tab
# 2. Search for "Isaac Sim"
# 3. Click "Install" (this will take 30-60 minutes, ~50GB download)
```

**Verify Installation**:
1. Open Omniverse Launcher
2. Go to "Library"
3. Click "Isaac Sim"
4. Launch Isaac Sim
5. Wait for loading (first launch takes 5-10 minutes)

---

### Step 5: Install Gazebo (Alternative Simulator)

```bash
# Install Gazebo Classic (for ROS 2 Humble)
sudo apt install ros-humble-gazebo-ros-pkgs

# Or install Gazebo Ignition (newer)
sudo apt install ros-humble-ros-ign-gazebo

# Verify
gazebo --version
```

---

### Step 6: Development Tools

#### VSCode (IDE)

```bash
# Download and install VSCode
sudo snap install --classic code

# Install extensions:
# - Python
# - ROS
# - C/C++ (if using C++)
# - GitLens
```

#### Python Tools

```bash
# Create virtual environment
python3 -m venv ~/ros2_venv
source ~/ros2_venv/bin/activate

# Install common packages
pip install numpy scipy matplotlib
pip install opencv-python
pip install torch torchvision  # PyTorch for ML
```

---

## Verification Checklist

Before proceeding to Module 1, verify:

```bash
# ✅ Ubuntu version
lsb_release -a
# Expected: Ubuntu 22.04 LTS

# ✅ NVIDIA driver
nvidia-smi
# Should show GPU info, no errors

# ✅ ROS 2 Humble
ros2 --version
# Expected: ros2 cli version 0.18.x

# ✅ Python version
python3 --version
# Expected: Python 3.10.x

# ✅ Git
git --version
# Expected: git version 2.34.1 or newer
```

---

## Troubleshooting

### Issue: "nvidia-smi: command not found"

**Solution**:
```bash
# Reinstall NVIDIA drivers
sudo apt purge nvidia-*
sudo ubuntu-drivers autoinstall
sudo reboot
```

### Issue: ROS 2 commands not found

**Solution**:
```bash
# Source ROS 2 setup
source /opt/ros/humble/setup.bash

# Add to .bashrc permanently
echo "source /opt/ros/humble/setup.bash" >> ~/.bashrc
```

### Issue: Isaac Sim crashes on launch

**Possible causes**:
1. Insufficient VRAM (need 8GB+)
2. Driver version mismatch
3. Missing Vulkan support

**Solution**:
```bash
# Update NVIDIA drivers to latest
sudo apt update
sudo apt upgrade nvidia-driver-525

# Install Vulkan
sudo apt install vulkan-tools
vulkaninfo  # Should show GPU info
```

---

## Estimated Setup Time

- **Local workstation**: 3-4 hours (including downloads)
- **Cloud instance**: 1-2 hours (faster downloads)
- **Debugging/troubleshooting**: +1-2 hours (if issues arise)

**Tip**: Do this setup over a weekend. Don't rush.

---

## What's Next?

Once your environment is ready, you're prepared to:

1. **Module 1**: Learn ROS 2 (works on any Ubuntu machine)
2. **Module 2**: Simulate robots in Gazebo (low GPU requirements)
3. **Module 3**: Train AI in Isaac Sim (requires RTX GPU or cloud)

---

## Key Takeaways

:::tip Setup Summary
1. **Ubuntu 22.04 LTS** is mandatory (ROS 2 Humble requirement)
2. **RTX GPU** needed for Isaac Sim (or use cloud)
3. **32GB RAM minimum**, 64GB recommended
4. **ROS 2 Humble** is the foundation for Modules 1-5
5. **NVIDIA drivers** must be installed correctly for GPU acceleration
6. **Cloud is viable** if local hardware isn't an option (~$200 for full course)
:::

## Check Your Readiness

Answer these questions:

1. Can you write Python classes and understand async/await?
2. Are you comfortable with Linux terminal commands?
3. Do you have an RTX GPU (local) or a cloud account (AWS/GCP)?
4. Have you successfully run `nvidia-smi` and `ros2 --version`?
5. Is Isaac Sim or Gazebo installed and launching successfully?

**If yes to all**: You're ready for Module 1!

**If no to some**: Review the prerequisite resources and set up missing components.

---

## Ready to Build Robots?

You're now equipped with the foundational knowledge and environment to begin your Physical AI journey.

→ **Start Module 1**: [ROS 2 Overview](../module1-ros2/01-ros2-overview.md)

Or review Module 0:
- [What is Physical AI?](./01-what-is-physical-ai.md)
- [Embodied Intelligence](./02-embodied-intelligence.md)
- [The Humanoid Landscape](./03-humanoid-landscape.md)

---

**Need help?** Use the AI chatbot (bottom-right) or open a GitHub issue.

**Let's build the future. 🚀**


---

**نوٹ**: یہ صفحہ اردو میں دستیاب ہے۔ مکمل ترجمہ جلد شامل کیا جائے گا۔

