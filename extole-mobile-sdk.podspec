require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "extole-mobile-sdk"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/extole/react-native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency "ExtoleMobileSDK", '~> 0.0.90'

  # React Native 0.71+ defines install_modules_dependencies, which declares the pods its own
  # version provides (prebuilt ReactNativeDependencies instead of RCT-Folly, ReactCodegen instead
  # of React-Codegen). See https://github.com/facebook/react-native/blob/v0.81.5/packages/react-native/scripts/cocoapods/new_architecture.rb
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
