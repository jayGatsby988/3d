export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Norton Home Remodeling</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium kitchen and bath remodeling with transparent pricing and exceptional craftsmanship.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/ai-3d-showroom" className="hover:text-white transition-colors">AI 3D Showroom</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Service Areas</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Westchester County, NY</li>
              <li>Fairfield County, CT</li>
              <li>Bergen County, NJ</li>
              <li>Rockland County, NY</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Phone: (914) 555-0100</li>
              <li>Email: info@nortonremodeling.com</li>
              <li>Hours: Mon-Fri 8AM-6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Norton Home Remodeling. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
