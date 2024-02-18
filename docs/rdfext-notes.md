file stuff - lots of Promises

typing of the nodes is confusing

testing equivalence/incudes() ref vs identity issues

feels clunky, but this works:

q.object.value == ns.something.value

aah, but this is better:

q.object.equals(ns.trm.Pipeline)

from https://rdf.js.org/dataset-spec/#quad-matching

(some tricks in https://stackoverflow.com/questions/1068834/object-comparison-in-javascript)
