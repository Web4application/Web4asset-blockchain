cmake_minimum_required(VERSION 3.1 FATAL_ERROR)

project(Web4asset VERSION 1.0 LANGUAGES CXX)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Oat++ and OpenSSL
find_package(oatpp 1.3.0 REQUIRED)
find_package(OpenSSL REQUIRED)

# Add the executable
add_executable(Web4asset main.cpp)

# Include oatpp headers (modern CMake way)
target_include_directories(Web4asset PRIVATE
  ${oatpp_INCLUDE_DIRS}
)

# Link oatpp and OpenSSL libraries
target_link_libraries(Web4asset
  ${oatpp_LIBRARIES}
  OpenSSL::SSL
  OpenSSL::Crypto
)

# Optional: Print some info for debugging
message(STATUS "Oatpp include dirs: ${oatpp_INCLUDE_DIRS}")
message(STATUS "OpenSSL include dir: ${OPENSSL_INCLUDE_DIR}")
