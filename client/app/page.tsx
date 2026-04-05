import {
  CheckCircle2,
  Zap,
  Users,
  BarChart3,
  Bell,
  Smartphone,
  Rocket,
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">TaskHub</div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </a>
          </div>
          <div className="space-x-4">
            <a
              href="/login"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            You don't just manage work—you make things happen.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            TaskHub is the ultimate task management platform for students and professionals. 
            Organize, collaborate, and achieve your goals together.
          </p>

          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-3xl font-bold text-blue-600 mb-2">100%</p>
              <p className="text-gray-600">Effort Tracked</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-3xl font-bold text-blue-600 mb-2">Real-time</p>
              <p className="text-gray-600">Collaboration</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-3xl font-bold text-blue-600 mb-2">Zero</p>
              <p className="text-gray-600">Chaos</p>
            </div>
          </div>

          <div className="space-x-4">
            <a
              href="/register"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Get Started Free
            </a>
            <a
              href="#features"
              className="inline-block px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Powerful Features for Every Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <CheckCircle2 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Task Management</h3>
              <p className="text-gray-600">
                Create, organize, and track tasks with ease. Set priorities, due dates, and 
                assign tasks to team members.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kanban Board</h3>
              <p className="text-gray-600">
                Visualize your workflow with our intuitive Kanban board. Drag and drop tasks 
                to update their status in real-time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-600">
                Work together seamlessly. Assign tasks, add comments, and keep everyone 
                on the same page.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Project Organization</h3>
              <p className="text-gray-600">
                Group related tasks into projects. Keep your work organized and easy to navigate 
                across multiple initiatives.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <Bell className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Updates</h3>
              <p className="text-gray-600">
                Stay informed with instant notifications. Get updates when tasks are assigned, 
                commented on, or completed.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <Smartphone className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Responsive Design</h3>
              <p className="text-gray-600">
                Access TaskHub from any device. Our responsive design works perfectly on 
                desktop, tablet, and mobile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About TaskHub</h2>
              <p className="text-lg text-gray-600 mb-4">
                TaskHub is designed for students and professionals who want to take control 
                of their projects. Whether you're managing a group project, leading a team, 
                or organizing personal tasks, TaskHub provides the tools you need.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Our mission is simple: make task management effortless so you can focus on 
                what really matters—getting things done.
              </p>
              <p className="text-lg text-gray-600">
                With an intuitive interface, powerful features, and real-time collaboration, 
                TaskHub helps teams work smarter and achieve more together.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-12 text-center">
              <Rocket className="w-24 h-24 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Started Today</h3>
              <p className="text-gray-600 mb-6">
                Join thousands of students and professionals using TaskHub to manage their 
                projects more effectively.
              </p>
              <a
                href="/register"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Create Free Account
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to transform how you work?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start managing your tasks smarter today. No credit card required.
          </p>
          <a
            href="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold"
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">TaskHub</h3>
              <p className="text-sm">
                The ultimate task management platform for students and professionals.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-white">
                    Login
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@taskhub.com</li>
                <li>Twitter: @TaskHub</li>
                <li>GitHub: TaskHub</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 TaskHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
