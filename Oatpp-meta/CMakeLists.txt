cmake_minimum_required(VERSION 3.5)
project(oatpp-meta VERSION 1.3.0)

include(CPack)

set(CPACK_PACKAGE_NAME "oatpp-meta")
set(CPACK_PACKAGE_VERSION ${PROJECT_VERSION})
set(CPACK_PACKAGE_CONTACT "you@example.com")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "Meta package to install oatpp and oatpp-curl")

set(CPACK_GENERATOR "DEB;RPM")

# Debian meta-package depends on oatpp and oatpp-curl
set(CPACK_DEBIAN_PACKAGE_DEPENDS "oatpp (>= 1.3.0), oatpp-curl (>= 1.3.0)")
set(CPACK_RPM_PACKAGE_REQUIRES "oatpp >= 1.3.0, oatpp-curl >= 1.3.0")
