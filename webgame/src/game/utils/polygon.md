
polygon shapes: 

methods: 




                         #VERSION_1  
                         -----------
                         -----------
                        //const poly = this.add.polygon(obj.x, obj.y, obj.polygon)
                        //poly.setOrigin(0, 0)
                        //this.matter.add.gameObject()
                        //this.matter.add.gameObject(poly, { shape: { type: 'fromVerts', verts: obj.polygon, flagInternal: true } });
                        const objPol = obj.polygon;
                        const polygon = new Phaser.Geom.Polygon(objPol)
                        const points: { x: number; y: number }[] = []
                        for (let point of polygon.points) {
                            points.push({
                                x: obj.x! + point.x,
                                y: obj.y! + point.y,
                            })
                        }

                        const poly2 = this.add.polygon(sliceCentre.x, sliceCentre.y, polygon.points)
                        const sliceCentre = this.matter.vertices.centre(points)
                        const body2 = this.matter.add.fromVertices(sliceCentre.x, sliceCentre.y, points, { label: obj.type })
                        const collision = this.matter.add.gameObject(
                            poly2,
                            body2
                        ) as Phaser.Physics.Matter.Sprite
                        collision.setStatic(true)
                        const collision = this.matter.add.gameObject(
                            poly2,
                            { shape: { type: 'fromVerts', verts: poly2, flagInternal: true }, isStatic: true, label: obj.type }
                        );
                        
                        //this.matter.bodies.polygon()
                        ------------------
                        ------------------



                        #VERSION_2
                        --------------
                        --------------
                        const sliceCentre = this.matter.vertices.centre(points)
                        this.matter.bodies.polygon(sliceCentre.x,sliceCentre.y,)

                        let verts2 = [
                            { x: 0, y: -50 },
                            { x: 50, y: 10 },
                            { x: -50, y: 25 }
                        ];
                        verts2 = polygon.points;
                        const body2 = this.matter.add.fromVertices(500, 300, verts2);

                        const polyVerts: any = [];

                        const bx = body2.position.x;
                        const by = body2.position.y;

                        const cx = body2.centerOffset.x;
                        const cy = body2.centerOffset.y;

                        body2.vertices!.forEach(vert => {
                            polyVerts.push({ x: vert.x - bx + cx, y: vert.y - by + cy });
                        });

                        const poly2 = this.add.polygon(bx, by, polyVerts, 0x8d8d8d);

                        //  Account for the fact that in this set of verts, the
                        //  origin isn't the center
                        poly2.setDisplayOrigin(cx, cy);

                        const collision = this.matter.add.gameObject(poly2, body2, false);

                        --------------------
                        -------------------
                        
                        
                        
                        #VERSION_3
                        --------------------
                        --------------------

                        function getVertices(items: Phaser.Types.Math.Vector2Like[]) {
                            return items.reduce((accumulator, item, index) => {
                                return `${accumulator}${item.x} ${item.y} `;
                            }, "").slice(0, -1);
                        }
                        console.log("polygon## =>", obj.polygon);
                        const vertices = getVertices(obj.polygon);
                        console.log("vertices polygon## =>", vertices);
                        const polygon2 = this.add.polygon(obj.x, obj.y, vertices);
                        const gameObject = this.matter.add.gameObject(polygon2, {
                            isStatic: true,
                            shape: {
                                type: "fromVertices",
                                verts: vertices,
                            },
                        }) as Phaser.Physics.Matter.Image;
                        const body = polygon2.body as MatterJS.BodyType;

                        gameObject.setPosition(polygon2.x + body.centerOffset.x, polygon2.y + body.centerOffset.y);
                        console.log('gameObject polygon : {{}} =>', (gameObject));
                        //console.log('collision: {{body ID}} =>', (collision.body as any).id);
                        ----------------------
                        ----------------------

