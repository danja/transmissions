// vis-turtle.js
import rdf from 'rdf-ext';
import { fromFile } from 'rdf-utils-fs';
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import fs from 'fs/promises';

// Create a virtual DOM
const dom = new JSDOM('<!DOCTYPE html><body></body>');
global.document = dom.window.document;
global.window = dom.window;

// Function to convert RDF dataset to JSON-LD like structure
function datasetToJsonld(dataset) {
    const jsonld = {};
    for (const quad of dataset) {
        const subject = quad.subject.value;
        const predicate = quad.predicate.value;
        const object = quad.object.termType === 'Literal' ? quad.object.value : { '@id': quad.object.value };

        if (!jsonld[subject]) {
            jsonld[subject] = { '@id': subject };
        }
        if (!jsonld[subject][predicate]) {
            jsonld[subject][predicate] = [];
        }
        jsonld[subject][predicate].push(object);
    }
    return Object.values(jsonld);
}

function jsonldVis(jsonldData, config) {
    config = config || {};
    const h = config.h || 600;
    const w = config.w || 800;
    const maxLabelWidth = config.maxLabelWidth || 250;
    const transitionDuration = config.transitionDuration || 750;
    const minRadius = config.minRadius || 5;
    const scalingFactor = config.scalingFactor || 2;

    const body = d3.select(document.body);
    const svg = body.append('svg')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', `translate(${maxLabelWidth},0)`);

    const tree = d3.tree().size([h, w]);

    const diagonal = d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x);

    // Create root from jsonldData
    const root = d3.hierarchy({
        name: 'RDF Graph',
        children: jsonldData.map(item => ({
            name: item['@id'],
            children: Object.entries(item)
                .filter(([key]) => key !== '@id')
                .map(([key, value]) => ({
                    name: key,
                    children: Array.isArray(value) ? value.map(v => ({ name: v['@id'] || v })) : [{ name: value['@id'] || value }]
                }))
        }))
    });

    root.x0 = h / 2;
    root.y0 = 0;

    update(root);

    function update(source) {
        const treeData = tree(root);
        const nodes = treeData.descendants();
        const links = treeData.links();

        nodes.forEach(d => { d.y = d.depth * maxLabelWidth; });

        const node = svg.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++i));

        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .on('click', (event, d) => {
                d.children = d.children ? null : d._children;
                update(d);
            });

        nodeEnter.append('circle')
            .attr('r', 1e-6)
            .style('fill', d => d._children ? 'lightsteelblue' : '#fff');

        nodeEnter.append('text')
            .attr('x', d => d.children || d._children ? -13 : 13)
            .attr('dy', '.35em')
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .text(d => d.data.name)
            .style('fill-opacity', 1e-6);

        const nodeUpdate = node.merge(nodeEnter).transition()
            .duration(transitionDuration)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        nodeUpdate.select('circle')
            .attr('r', 10)
            .style('fill', d => d._children ? 'lightsteelblue' : '#fff');

        nodeUpdate.select('text')
            .style('fill-opacity', 1);

        const nodeExit = node.exit().transition()
            .duration(transitionDuration)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);

        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        const link = svg.selectAll('path.link')
            .data(links, d => d.target.id);

        link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });

        link.merge(link).transition()
            .duration(transitionDuration)
            .attr('d', diagonal);

        link.exit().transition()
            .duration(transitionDuration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .remove();

        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }
    update(root);
    return body.html();
}

function changeSVGWidth(newWidth) {
    if (w !== newWidth) {
        d3.select(selector + ' > svg').attr('width', newWidth);
    }
}

function jsonldTree(source) {
    var tree = {};

    if ('@id' in source) {
        tree.isIdNode = true;
        tree.name = source['@id'];
        if (tree.name.length > maxLabelWidth / 9) {
            tree.valueExtended = tree.name;
            tree.name = '...' + tree.valueExtended.slice(-Math.floor(maxLabelWidth / 9));
        }
    } else {
        tree.isIdNode = true;
        tree.isBlankNode = true;
        // random id, can replace with actual uuid generator if needed
        tree.name = '_' + Math.random().toString(10).slice(-7);
    }

    var children = [];
    Object.keys(source).forEach(function (key) {
        if (key === '@id' || key === '@context' || source[key] === null) return;

        var valueExtended, value;
        if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
            children.push({
                name: key,
                children: [jsonldTree(source[key])]
            });
        } else if (Array.isArray(source[key])) {
            children.push({
                name: key,
                children: source[key].map(function (item) {
                    if (typeof item === 'object') {
                        return jsonldTree(item);
                    } else {
                        return { name: item };
                    }
                })
            });
        } else {
            valueExtended = source[key];
            value = valueExtended;
            if (value.length > maxLabelWidth / 9) {
                value = value.slice(0, Math.floor(maxLabelWidth / 9)) + '...';
                children.push({
                    name: key,
                    value: value,
                    valueExtended: valueExtended
                });
            } else {
                children.push({
                    name: key,
                    value: value
                });
            }
        }
    });

    if (children.length) {
        tree.children = children;
    }

    return tree;
}

function update(source) {
    var nodes = tree.nodes(root).reverse();
    var links = tree.links(nodes);

    nodes.forEach(function (d) { d.y = d.depth * maxLabelWidth; });

    var node = svg.selectAll('g.node')
        .data(nodes, function (d) { return d.id || (d.id = ++i); });

    var nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (d) { return 'translate(' + source.y0 + ',' + source.x0 + ')'; })
        .on('click', click);

    nodeEnter.append('circle')
        .attr('r', 0)
        .style('stroke-width', function (d) {
            return d.isIdNode ? '2px' : '1px';
        })
        .style('stroke', function (d) {
            return d.isIdNode ? '#F7CA18' : '#4ECDC4';
        })
        .style('fill', function (d) {
            if (d.isIdNode) {
                return d._children ? '#F5D76E' : 'white';
            } else {
                return d._children ? '#86E2D5' : 'white';
            }
        })
        .on('mouseover', function (d) { if (d.valueExtended) tip.show(d); })
        .on('mouseout', tip.hide);

    nodeEnter.append('text')
        .attr('x', function (d) {
            var spacing = computeRadius(d) + 5;
            return d.children || d._children ? -spacing : spacing;
        })
        .attr('dy', '4')
        .attr('text-anchor', function (d) { return d.children || d._children ? 'end' : 'start'; })
        .text(function (d) { return d.name + (d.value ? ': ' + d.value : ''); })
        .style('fill-opacity', 0);

    var maxSpan = Math.max.apply(Math, nodes.map(function (d) { return d.y + maxLabelWidth; }));
    if (maxSpan + maxLabelWidth + 20 > w) {
        changeSVGWidth(maxSpan + maxLabelWidth);
        d3.select(selector).node().scrollLeft = source.y0;
    }

    var nodeUpdate = node.transition()
        .duration(transitionDuration)
        .ease(transitionEase)
        .attr('transform', function (d) { return 'translate(' + d.y + ',' + d.x + ')'; });

    nodeUpdate.select('circle')
        .attr('r', function (d) { return computeRadius(d); })
        .style('stroke-width', function (d) {
            return d.isIdNode ? '2px' : '1px';
        })
        .style('stroke', function (d) {
            return d.isIdNode ? '#F7CA18' : '#4ECDC4';
        })
        .style('fill', function (d) {
            if (d.isIdNode) {
                return d._children ? '#F5D76E' : 'white';
            } else {
                return d._children ? '#86E2D5' : 'white';
            }
        });

    nodeUpdate.select('text').style('fill-opacity', 1);

    var nodeExit = node.exit().transition()
        .duration(transitionDuration)
        .ease(transitionEase)
        .attr('transform', function (d) { return 'translate(' + source.y + ',' + source.x + ')'; })
        .remove();

    nodeExit.select('circle').attr('r', 0);
    nodeExit.select('text').style('fill-opacity', 0);

    var link = svg.selectAll('path.link')
        .data(links, function (d) { return d.target.id; });

    link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function (d) {
            var o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
        });

    link.transition()
        .duration(transitionDuration)
        .ease(transitionEase)
        .attr('d', diagonal);

    link.exit().transition()
        .duration(transitionDuration)
        .ease(transitionEase)
        .attr('d', function (d) {
            var o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
        })
        .remove();

    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

function computeRadius(d) {
    if (d.children || d._children) {
        return minRadius + (numEndNodes(d) / scalingFactor);
    } else {
        return minRadius;
    }
}

function numEndNodes(n) {
    var num = 0;
    if (n.children) {
        n.children.forEach(function (c) {
            num += numEndNodes(c);
        });
    } else if (n._children) {
        n._children.forEach(function (c) {
            num += numEndNodes(c);
        });
    } else {
        num++;
    }
    return num;
}

function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }

    update(d);

    // fast-forward blank nodes
    if (d.children) {
        d.children.forEach(function (child) {
            if (child.isBlankNode && child._children) {
                click(child);
            }
        });
    }
}

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}


// Main function to generate visualization from Turtle file
export async function visualizeTurtle(turtleFile, outputFile) {
    try {
        const stream = fromFile(turtleFile);
        const dataset = await rdf.dataset().import(stream);
        const jsonldData = datasetToJsonld(dataset);
        const svgContent = jsonldVis(jsonldData);

        await fs.writeFile(outputFile, svgContent);
        console.log(`Visualization saved to ${outputFile}`);
    } catch (error) {
        console.error('Error generating visualization:', error);
    }
}

// Usage
visualizeTurtle('test-data/foaf-template.ttl', 'output.svg');