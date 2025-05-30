cmake_minimum_required(VERSION 3.5)
project(oatpp VERSION 1.3.0 LANGUAGES CXX)

# Options
option(OATPP_BUILD_TESTS "Build oatpp tests" OFF)
option(BUILD_SHARED_LIBS "Build shared libraries" ON)

# Add source
add_subdirectory(src)

# Install headers
install(DIRECTORY src/
        DESTINATION include/oatpp
        FILES_MATCHING PATTERN "*.hpp")

# Install target
install(TARGETS oatpp
        EXPORT oatpp-targets
        ARCHIVE DESTINATION lib
        LIBRARY DESTINATION lib
        RUNTIME DESTINATION bin)

# CPack settings
include(CPack)

set(CPACK_PACKAGE_NAME "oatpp")
set(CPACK_PACKAGE_VERSION ${PROJECT_VERSION})
set(CPACK_PACKAGE_CONTACT "you@example.com")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Lightweight web framework for C++.")
set(CPACK_RESOURCE_FILE_LICENSE "${CMAKE_SOURCE_DIR}/LICENSE")
set(CPACK_RESOURCE_FILE_README "${CMAKE_SOURCE_DIR}/README.md")

# Debian-specific
set(CPACK_DEBIAN_PACKAGE_MAINTAINER "Your Name")
set(CPACK_GENERATOR "DEB")
