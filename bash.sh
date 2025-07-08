% git tag -v v0.6.0 | grep -C 3 'Good signature'

gpg: Signature made Mon 04 Nov 2024 12:14:44 PM EST
gpg:                using RSA key 4BBB845A6F5A65A69DFAEC234861DBF262123605
gpg: Good signature from "Jonas Nick <jonas@n-ck.net>" [unknown]
gpg:                 aka "Jonas Nick <jonasd.nick@gmail.com>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 36C7 1A37 C9D9 88BD E825  08D9 B1A7 0E4F 8DCD 0366
     Subkey fingerprint: 4BBB 845A 6F5A 65A6 9DFA  EC23 4861 DBF2 6212 3605

gpg --keyserver hkps://keys.openpgp.org --recv-keys "<09E0 3F87 1092 E40E 106E 902B 33BC 86AB 80FF 5516>"

$ ./autogen.sh       # Generate a ./configure script
$ ./configure        # Generate a build system
$ make               # Run the actual build process
$ make check         # Run the test suite
$ sudo make install  # Install the library into the system (optional)

$ cmake -B build              # Generate a build system in subdirectory "build"
$ cmake --build build         # Run the actual build process
$ ctest --test-dir build      # Run the test suite
$ sudo cmake --install build  # Install the library into the system (optional)

$ cmake -B build -DCMAKE_TOOLCHAIN_FILE=cmake/x86_64-w64-mingw32.toolchain.cmake
