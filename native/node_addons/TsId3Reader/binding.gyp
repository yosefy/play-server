{
  "targets": [
    {
      "target_name": "TsId3Reader",
      "sources": [ "TsId3Reader.cc", "../../common/src/mpegTs.c", "../../common/src/common.c" ],
      'include_dirs': [
        "<!(node -p -e \"require('path').relative('.', require('path').dirname(require.resolve('nan')))\")",
	"../../common/include"
      ],
      "libraries": ["-lid3"]
    }
  ]
}