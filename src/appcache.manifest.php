<?php

header('Content-type: text/cache-manifest');
header('Content-Disposition: attachment; filename="appcache.manifest"');

readfile('appcache.manifest');