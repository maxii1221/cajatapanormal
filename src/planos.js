// Seleccionar el contenedor SVG en el canvas de designCanvas
const designCanvas = document.getElementById('designCanvas');
paper.setup(designCanvas);


// Función para crear el plano de la caja en 2D usando milímetros
function create2DBox(width, height, depth, thickness, withLid) {
    // Limpiar el lienzo antes de dibujar
    paper.project.activeLayer.removeChildren();

    // Escala para convertir mm a px (por ejemplo, 1mm = 3.78px)
    const scale = 3.78;
    const overlap = 0.1 * scale; // Superposición de 0.1 px para las uniones

    // Define un margen de separación entre las partes de la caja
    const spacing = 10 * scale; // Ajusta este valor según el espaciado deseado

    // Crear la base de la caja
        const base = new paper.Path.Rectangle({
        point: [20 * scale, 20 * scale],
        size: [width * scale, depth * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Crear los encastres en la parte superior e inferior
    const encastreWidth = width * 0.5;
    const encastreHeight = thickness;

    // Encastre superior
    const encastreTop = new paper.Path.Rectangle({
        point: [(20 + (width - encastreWidth) / 2) * scale, (20 - encastreHeight) * scale - overlap],
        size: [encastreWidth * scale, encastreHeight * scale + overlap],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre inferior
    const encastreBottom = new paper.Path.Rectangle({
        point: [(20 + (width - encastreWidth) / 2) * scale, (20 + depth) * scale],
        size: [encastreWidth * scale, encastreHeight * scale + overlap],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastres laterales
    const encastreSideHeight = depth * 0.5;
    const encastreSideWidth = thickness;

    // Encastre izquierdo
    const encastreLeft = new paper.Path.Rectangle({
        point: [(20 - encastreSideWidth) * scale - overlap, (20 + (depth - encastreSideHeight) / 2) * scale],
        size: [encastreSideWidth * scale + overlap, encastreSideHeight * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre derecho
    const encastreRight = new paper.Path.Rectangle({
        point: [(20 + width) * scale, (20 + (depth - encastreSideHeight) / 2) * scale],
        size: [encastreSideWidth * scale + overlap, encastreSideHeight * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });
    
    // Operaciones booleanas para unir los encastres a la base
    let baseWithTop = base.unite(encastreTop);
    let baseWithTopBottom = baseWithTop.unite(encastreBottom);
    let baseWithTopBottomLeft = baseWithTopBottom.unite(encastreLeft);
    let finalBase = baseWithTopBottomLeft.unite(encastreRight);

    // Eliminar los objetos de encastres y la base original después de la unión
    base.remove();
    encastreTop.remove();
    encastreBottom.remove();
    encastreLeft.remove();
    encastreRight.remove();
    baseWithTop.remove();
    baseWithTopBottom.remove();
    baseWithTopBottomLeft.remove();

    // Asignar el color de borde al resultado final
    finalBase.strokeColor = 'black';


    const trasera = new paper.Path.Rectangle({
        point: [base.bounds.right + spacing, base.bounds.top],
        size: [(width + 6) * scale, height * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });
    // Encastre inferior centrado en la parte inferior de trasera
    const encastreBottomTrasera = new paper.Path.Rectangle({
        point: [
            trasera.bounds.center.x - (encastreWidth * scale) / 2, // Centrado en el ancho de 'trasera'
            trasera.bounds.bottom - (encastreHeight * scale + overlap) // Posición en la parte inferior de 'trasera'
            ],
        size: [encastreWidth * scale, encastreHeight * scale + overlap],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastres laterales
    const encastreSideHeightTrasera = height * 0.5;
    const encastreSideWidthTrasera = thickness;

    // Encastre izquierdo
    const encastreLeftTrasera = new paper.Path.Rectangle({
        point: [
            trasera.bounds.left, // Posición en el borde derecho de 'trasera'
            trasera.bounds.center.y - (encastreSideHeightTrasera * scale) / 2 // Centrado en el eje Y de 'trasera'
        ],
        size: [encastreSideWidthTrasera * scale + overlap, encastreSideHeightTrasera * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre derecho centrado en el eje Y de 'trasera'
    const encastreRightTrasera = new paper.Path.Rectangle({
        point: [
            trasera.bounds.right - (encastreSideWidthTrasera * scale), // Posición en el borde derecho de 'trasera'
            trasera.bounds.center.y - (encastreSideHeightTrasera * scale) / 2 // Centrado en el eje Y de 'trasera'
        ],
        size: [encastreSideWidthTrasera * scale + overlap, encastreSideHeightTrasera * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Operaciones booleanas para unir los encastres a la parte trasera
    let traseraWithBottom = trasera.subtract(encastreBottomTrasera);
    let traseraWithBottomLeft = traseraWithBottom.subtract(encastreLeftTrasera);
    let finalTrasera = traseraWithBottomLeft.subtract(encastreRightTrasera);

    // Eliminar los objetos de encastres y la trasera original después de la unión
    trasera.remove();
    encastreBottomTrasera.remove();
    encastreLeftTrasera.remove();
    encastreRightTrasera.remove();
    traseraWithBottom.remove();
    traseraWithBottomLeft.remove();

    // Asignar el color de borde al resultado final
    finalTrasera.strokeColor = 'black';


    const delantera = new paper.Path.Rectangle({
        point: [trasera.bounds.right + spacing, trasera.bounds.top],
        size: [(width + 6) * scale, height * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });
        
    // Encastre inferior centrado en la parte inferior de delantera
    const encastreBottomDelantera = new paper.Path.Rectangle({
        point: [
            delantera.bounds.center.x - (encastreWidth * scale) / 2, // Centrado en el ancho de 'trasera'
            delantera.bounds.bottom - (encastreHeight * scale + overlap) // Posición en la parte inferior de 'trasera'
            ],
        size: [encastreWidth * scale, encastreHeight * scale + overlap],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre izquierdo
    const encastreLeftDelantera = new paper.Path.Rectangle({
        point: [
            delantera.bounds.left, // Posición en el borde derecho de 'trasera'
            delantera.bounds.center.y - (encastreSideHeightTrasera * scale) / 2 // Centrado en el eje Y de 'trasera'
        ],
        size: [encastreSideWidthTrasera * scale + overlap, encastreSideHeightTrasera * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre derecho centrado en el eje Y de 'delantera'
    const encastreRightDelantera = new paper.Path.Rectangle({
        point: [
            delantera.bounds.right - (encastreSideWidthTrasera * scale), // Posición en el borde derecho de 'trasera'
            delantera.bounds.center.y - (encastreSideHeightTrasera * scale) / 2 // Centrado en el eje Y de 'trasera'
        ],
        size: [encastreSideWidthTrasera * scale + overlap, encastreSideHeightTrasera * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Operaciones booleanas para unir los encastres a la parte delantera
    let delanteraWithBottom = delantera.subtract(encastreBottomDelantera);
    let delanteraWithBottomLeft = delanteraWithBottom.subtract(encastreLeftDelantera);
    let finalDelantera = delanteraWithBottomLeft.subtract(encastreRightDelantera);

    // Eliminar los objetos de encastres y la delantera original después de la unión
    delantera.remove();
    encastreBottomDelantera.remove();
    encastreLeftDelantera.remove();
    encastreRightDelantera.remove();
    delanteraWithBottom.remove();
    delanteraWithBottomLeft.remove();

    // Asignar el color de borde al resultado final
    finalDelantera.strokeColor = 'black';


    const encastreSideHeightLaterales = depth * 0.5;
    const encastreSideWidthLaterales = thickness;
    const encastreSideHeightLateraleslat = height * 0.5;

    // Crear la figura izquierda
    const izquierda = new paper.Path.Rectangle({
        point: [20 * scale, base.bounds.bottom + spacing],
        size: [depth * scale, height * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre inferior centrado en la parte inferior de 'izquierda'
    const encastreBottomIzquierda = new paper.Path.Rectangle({
        point: [
            izquierda.bounds.center.x - (encastreSideHeightLaterales * scale) / 2, // Centrado en el ancho de 'izquierda'
            izquierda.bounds.bottom - (encastreSideWidthLaterales * scale + overlap) // Posición en la parte inferior de 'izquierda'
        ],
        size: [encastreSideHeightLaterales * scale, encastreSideWidthLaterales * scale + overlap],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre izquierdo en el eje Y de 'izquierda'
    const encastreLeftIzquierda = new paper.Path.Rectangle({
        point: [
            izquierda.bounds.left - (encastreSideWidthLaterales * scale + overlap), // Posición en el borde izquierdo de 'izquierda'
            izquierda.bounds.center.y - (encastreSideHeightLateraleslat * scale) / 2 // Centrado en el eje Y de 'izquierda'
        ],
        size: [encastreSideWidthLaterales * scale + overlap, encastreSideHeightLateraleslat * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre derecho en el eje Y de 'izquierda'
    const encastreRightIzquierda = new paper.Path.Rectangle({
        point: [
            izquierda.bounds.right, // Posición en el borde derecho de 'izquierda'
            izquierda.bounds.center.y - (encastreSideHeightLateraleslat * scale) / 2 // Centrado en el eje Y de 'izquierda'
        ],
        size: [encastreSideWidthLaterales * scale + overlap, encastreSideHeightLateraleslat  * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

// operaciones booleanas para unir estos encastres a la figura 'izquierda'
    let izquierdaWithBottom = izquierda.subtract(encastreBottomIzquierda);
    let izquierdaWithLeft = izquierdaWithBottom.unite(encastreLeftIzquierda);
    let finalIzquierda = izquierdaWithLeft.unite(encastreRightIzquierda);

// Eliminar los objetos de encastres y la figura 'izquierda' después de la unión si decides hacer las operaciones booleanas
    izquierda.remove();
    encastreBottomIzquierda.remove();
    encastreLeftIzquierda.remove();
    encastreRightIzquierda.remove();
    izquierdaWithBottom.remove();
    izquierdaWithLeft.remove();

    finalIzquierda.strokeColor = 'black';

    
    // Crear la figura derecha
    const derecha = new paper.Path.Rectangle({
        point: [izquierda.bounds.right + spacing, izquierda.bounds.top],
        size: [depth * scale, height * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre inferior centrado en la parte inferior de 'derecha'
    const encastreBottomDerecha = new paper.Path.Rectangle({
        point: [
            derecha.bounds.center.x - (encastreSideHeightLaterales * scale) / 2, // Centrado en el ancho de 'derecha'
            derecha.bounds.bottom - (encastreSideWidthLaterales * scale + overlap) // Posición en la parte inferior de 'derecha'
        ],
        size: [encastreSideHeightLaterales * scale, encastreSideWidthLaterales * scale + overlap],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre izquierdo en el eje Y de 'derecha'
    const encastreLeftDerecha = new paper.Path.Rectangle({
        point: [
            derecha.bounds.left - (encastreSideWidthLaterales * scale + overlap), // Posición en el borde izquierdo de 'derecha'
            derecha.bounds.center.y - (encastreSideHeightLateraleslat * scale) / 2 // Centrado en el eje Y de 'derecha'
        ],
        size: [encastreSideWidthLaterales * scale + overlap, encastreSideHeightLateraleslat * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Encastre derecho en el eje Y de 'derecha'
    const encastreRightDerecha = new paper.Path.Rectangle({
        point: [
            derecha.bounds.right, // Posición en el borde derecho de 'derecha'
            derecha.bounds.center.y - (encastreSideHeightLateraleslat * scale) / 2 // Centrado en el eje Y de 'derecha'
        ],
        size: [encastreSideWidthLaterales * scale + overlap, encastreSideHeightLateraleslat  * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

// operaciones booleanas para unir estos encastres a la figura 'derecha'
    let derechaWithBottom = derecha.subtract(encastreBottomDerecha);
    let derechaWithLeft = derechaWithBottom.unite(encastreLeftDerecha);
    let finalDerecha = derechaWithLeft.unite(encastreRightDerecha);

// Eliminar los objetos de encastres y la figura 'derecha' después de la unión si decides hacer las operaciones booleanas
    derecha.remove();
    encastreBottomDerecha.remove();
    encastreLeftDerecha.remove();
    encastreRightDerecha.remove();
    derechaWithBottom.remove();
    derechaWithLeft.remove();

    finalDerecha.strokeColor = 'black';

    // Calcular la longitud total del contorno
    let totalLength = 0;

    // Sumar la longitud de cada figura final
    totalLength += finalBase.length;
    totalLength += finalTrasera.length;
    totalLength += finalDelantera.length;
    totalLength += finalIzquierda.length;
    totalLength += finalDerecha.length;

    // Calcular el área total de las piezas de la caja
    let totalArea = 0;

    // Agregar las áreas de cada pieza
    totalArea += width * depth; // Base
    totalArea += width * height; // Trasera
    totalArea += width * height; // Delantera
    totalArea += depth * height; // Lateral derecho
    totalArea += depth * height; // Lateral izquierdo

    if (withLid) {
        // Tamaño de la tapa, 3.5 mm extra en cada lado (7 mm en total)
        const lidWidth = width + 7;
        const lidDepth = depth + 7;
        let lidHeight;

        if (height <= 20) {
            lidHeight = 10 * scale;
        }else if(height > 20 && height <= 80) {
            lidHeight = 15 * scale
        }else if(height > 80 && height <= 250) {
            lidHeight = 20 * scale
        }else{
            lidHeight = 30 * scale
        }

        const encastreWidthTP = width * 0.5;
        const encastreHeightTP = thickness;
        
        const encastreSideHeightTP = depth * 0.5;
        const encastreSideWidthTP = thickness;

        const encastreSideHeightTraseraTP = lidHeight / 2;
        const encastreSideWidthTraseraTP = thickness;
    
        // Crear la base de la tapa con el tamaño ajustado
        const tapaBase = new paper.Path.Rectangle({
            point: [derecha.bounds.right + spacing, derecha.bounds.top],
            size: [lidWidth * scale, lidDepth * scale],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });

        
        // Encastre superior
        const encastreTopTP = new paper.Path.Rectangle({
            point: [
                tapaBase.bounds.center.x - (encastreWidthTP * scale) / 2,
                tapaBase.bounds.top - (encastreHeightTP * scale + overlap)
                ],
            size: [encastreWidthTP * scale, encastreHeightTP * scale + overlap],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
            });
        
        // Encastre inferior
        const encastreBottomTP = new paper.Path.Rectangle({  
            point: [
                    tapaBase.bounds.center.x - (encastreWidthTP * scale) / 2,
                    tapaBase.bounds.bottom
                    ],
            size: [encastreWidthTP * scale, encastreHeightTP * scale + overlap],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
        
        
        // Encastre izquierdo
        const encastreLeftTP = new paper.Path.Rectangle({
            point:[            
            tapaBase.bounds.left - (encastreSideWidthTP * scale + overlap), // Posición en el borde izquierdo de 'izquierda'
            tapaBase.bounds.center.y - (encastreSideHeightTP * scale) / 2
            ],
            size: [encastreSideWidthTP * scale + overlap, encastreSideHeightTP * scale],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
        
        // Encastre derecho
        const encastreRightTP = new paper.Path.Rectangle({
            point:[            
                tapaBase.bounds.right , // Posición en el borde izquierdo de 'izquierda'
                tapaBase.bounds.center.y - (encastreSideHeightTP * scale) / 2
                ],
            size: [encastreSideWidthTP * scale + overlap, encastreSideHeightTP * scale],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
            
        // Operaciones booleanas para unir los encastres a la tapa base
        let baseWithTopTP = tapaBase.unite(encastreTopTP);
        let baseWithTopBottomTP = baseWithTopTP.unite(encastreBottomTP);
        let baseWithTopBottomLeftTP = baseWithTopBottomTP.unite(encastreLeftTP);
        let finalBaseTP = baseWithTopBottomLeftTP.unite(encastreRightTP);
        
        // Eliminar los objetos de encastres y la base original después de la unión
        tapaBase.remove();
        encastreTopTP.remove();
        encastreBottomTP.remove();
        encastreLeftTP.remove();
        encastreRightTP.remove();
        baseWithTopTP.remove();
        baseWithTopBottomTP.remove();
        baseWithTopBottomLeftTP.remove();
        
        // Asignar el color de borde al resultado final
        finalBaseTP.strokeColor = 'black';

        // Crear lado trasero de la tapa
        const tapaTrasera = new paper.Path.Rectangle({
            point: [20 * scale, izquierda.bounds.bottom + spacing],
            size: [lidWidth * scale, lidHeight],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });

        // Encastre inferior
        const encastreBottomTpTrasera = new paper.Path.Rectangle({  
            point: [
                tapaTrasera.bounds.center.x - (encastreWidthTP * scale) / 2,
                tapaTrasera.bounds.bottom - (encastreHeightTP * scale)
                ],
            size: [encastreWidthTP * scale, encastreHeightTP * scale + overlap],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
  

        const encastreLeftTpTrasera = new paper.Path.Rectangle({
            point: [
                tapaTrasera.bounds.left - thickness * scale, 
                tapaTrasera.bounds.center.y - encastreSideHeightTraseraTP / 2 // Centrado en el eje Y de 'trasera'
            ],   
            size: [
                encastreSideWidthTraseraTP * scale + overlap,
                encastreSideHeightTraseraTP 
            ],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });

        const encastreRightTpTrasera = new paper.Path.Rectangle({
            point: [
                tapaTrasera.bounds.right , 
                tapaTrasera.bounds.center.y - encastreSideHeightTraseraTP / 2 // Centrado en el eje Y de 'trasera'  
            ],
            size: [
                encastreSideWidthTraseraTP * scale + overlap,
                encastreSideHeightTraseraTP
            ],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
         
        let tapaTraseraWithTop = tapaTrasera.subtract(encastreBottomTpTrasera);
        let tapaTraseraWithTopRight = tapaTraseraWithTop.unite(encastreLeftTpTrasera);
        let finaltapaTrasera = tapaTraseraWithTopRight.unite(encastreRightTpTrasera);

        tapaTrasera.remove();
        encastreBottomTpTrasera.remove();
        encastreLeftTpTrasera.remove();
        encastreRightTpTrasera.remove();
        tapaTraseraWithTop.remove();
        tapaTraseraWithTopRight.remove();

        finaltapaTrasera.strokeColor = 'black'; 


        // Crear lado Delantera de la tapa
        const tapaDelantera = new paper.Path.Rectangle({
            point: [20 * scale, tapaTrasera.bounds.bottom + spacing],
            size: [lidWidth * scale, lidHeight],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });

        // Encastre inferior
        const encastreBottomTpDelantera = new paper.Path.Rectangle({  
            point: [
                tapaDelantera.bounds.center.x - (encastreWidthTP * scale) / 2,
                tapaDelantera.bounds.bottom - (encastreHeightTP * scale)
                ],
            size: [encastreWidthTP * scale, encastreHeightTP * scale + overlap],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
  

        const encastreLeftTpDelantera = new paper.Path.Rectangle({
            point: [
                tapaDelantera.bounds.left - thickness * scale, 
                tapaDelantera.bounds.center.y - encastreSideHeightTraseraTP / 2 // Centrado en el eje Y de 'trasera'
            ],   
            size: [
                encastreSideWidthTraseraTP * scale + overlap,
                encastreSideHeightTraseraTP 
            ],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });

        const encastreRightTpDelantera = new paper.Path.Rectangle({
            point: [
                tapaDelantera.bounds.right , 
                tapaDelantera.bounds.center.y - encastreSideHeightTraseraTP / 2 // Centrado en el eje Y de 'trasera'  
            ],
            size: [
                encastreSideWidthTraseraTP * scale + overlap,
                encastreSideHeightTraseraTP
            ],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
        
        // Operaciones booleanas para unir los encastres a la tapa base
        let tapaDelanteraWithTop = tapaDelantera.subtract(encastreBottomTpDelantera);
        let tapaDelanteraWithTopRight = tapaDelanteraWithTop.unite(encastreLeftTpDelantera);
        let finaltapaDelantera = tapaDelanteraWithTopRight.unite(encastreRightTpDelantera);

        tapaDelantera.remove();
        encastreBottomTpDelantera.remove();
        encastreLeftTpDelantera.remove();
        encastreRightTpDelantera.remove();
        tapaDelanteraWithTop.remove();
        tapaDelanteraWithTopRight.remove();

        finaltapaDelantera.strokeColor = 'black';

        
        // Crear lado izquierdo de la tapa
        const tapaIzquierda = new paper.Path.Rectangle({
            point: [20 * scale, tapaDelantera.bounds.bottom + spacing],
            size: [(lidDepth + 6) * scale, lidHeight],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });

        // Encastre inferior
        const encastreBottomTpIzquierda = new paper.Path.Rectangle({  
            point: [
                tapaIzquierda.bounds.center.x - (((lidDepth - 7)  * scale ) / 2) / 2,
                tapaIzquierda.bounds.bottom - (thickness * scale)
                ],
            size: [((lidDepth  - 7)  * scale) / 2, thickness * scale + overlap],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
  

        const encastreLeftTpIzquierda = new paper.Path.Rectangle({
            point: [
                tapaIzquierda.bounds.left, 
                tapaIzquierda.bounds.center.y - encastreSideHeightTraseraTP / 2 // Centrado en el eje Y de 'trasera'
            ],   
            size: [
                encastreSideWidthTraseraTP * scale + overlap,
                encastreSideHeightTraseraTP 
            ],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });

        const encastreRightTpIzquierda = new paper.Path.Rectangle({
            point: [
                tapaIzquierda.bounds.right  - thickness * scale, 
                tapaIzquierda.bounds.center.y - encastreSideHeightTraseraTP / 2 // Centrado en el eje Y de 'trasera'  
            ],
            size: [
                encastreSideWidthTraseraTP * scale + overlap,
                encastreSideHeightTraseraTP
            ],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
        
        let tapaIzquierdaWithTop = tapaIzquierda.subtract(encastreBottomTpIzquierda);
        let tapaIzquierdaWithTopRight = tapaIzquierdaWithTop.subtract(encastreLeftTpIzquierda);
        let finaltapaIzquierda = tapaIzquierdaWithTopRight.subtract(encastreRightTpIzquierda);

        tapaIzquierda.remove();
        encastreBottomTpIzquierda.remove();
        encastreLeftTpIzquierda.remove();
        encastreRightTpIzquierda.remove();
        tapaIzquierdaWithTop.remove();
        tapaIzquierdaWithTopRight.remove();

        finaltapaIzquierda.strokeColor = 'black';

        // Crear lado Derecha de la tapa
        const tapaDerecha = new paper.Path.Rectangle({
            point: [20 * scale, tapaIzquierda.bounds.bottom + spacing],
            size: [(lidDepth + 6) * scale, lidHeight],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });

        // Encastre inferior
        const encastreBottomTpDerecha = new paper.Path.Rectangle({  
            point: [
                tapaDerecha.bounds.center.x - (((lidDepth - 7)  * scale ) / 2) / 2,
                tapaDerecha.bounds.bottom - (thickness * scale)
                ],
            size: [((lidDepth  - 7)  * scale) / 2, thickness * scale + overlap],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
  

        const encastreLeftTpDerecha = new paper.Path.Rectangle({
            point: [
                tapaDerecha.bounds.left, 
                tapaDerecha.bounds.center.y - encastreSideHeightTraseraTP / 2 // Centrado en el eje Y de 'trasera'
            ],   
            size: [
                encastreSideWidthTraseraTP * scale + overlap,
                encastreSideHeightTraseraTP 
            ],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });

        const encastreRightTpDerecha = new paper.Path.Rectangle({
            point: [
                tapaDerecha.bounds.right  - thickness * scale, 
                tapaDerecha.bounds.center.y - encastreSideHeightTraseraTP / 2 // Centrado en el eje Y de 'trasera'  
            ],
            size: [
                encastreSideWidthTraseraTP * scale + overlap,
                encastreSideHeightTraseraTP
            ],
            strokeColor: 'black',
            strokeWidth: 1,
            fillColor: null
        });
        
        let tapaDerechaWithTop = tapaDerecha.subtract(encastreBottomTpDerecha);
        let tapaDerechaWithTopRight = tapaDerechaWithTop.subtract(encastreLeftTpDerecha);
        let finaltapaDerecha = tapaDerechaWithTopRight.subtract(encastreRightTpDerecha);

        tapaDerecha.remove();
        encastreBottomTpDerecha.remove();
        encastreLeftTpDerecha.remove();
        encastreRightTpDerecha.remove();
        tapaDerechaWithTop.remove();
        tapaDerechaWithTopRight.remove();

        finaltapaDerecha.strokeColor = 'black';
        
        totalLength += tapaBase.length;
        totalLength += tapaDelantera.length;
        totalLength += tapaTrasera.length;
        totalLength += tapaIzquierda.length;
        totalLength += tapaDerecha.length;

        totalArea += lidWidth * lidDepth; // tapa
        totalArea += lidWidth * (lidHeight / scale); // Trasera
        totalArea += lidWidth * (lidHeight / scale); // Delantera
        totalArea += lidDepth * (lidHeight / scale); // Lateral derecho
        totalArea += lidDepth * (lidHeight / scale); // Lateral izquierdo


    } else if (baseTapa) {
        
    }
    

    // Convertir la longitud de px a mm (1px = 1 / 3.78 mm)
    totalLength = totalLength / 3.78;

    // Calcular el tiempo estimado (velocidad de 18 mm/s)
    const cuttingTime = totalLength / 18;

    // Mostrar el tiempo estimado en el span
    document.getElementById("cuttingTime").textContent = cuttingTime.toFixed(2);

    // Calcular el costo estimado de corte (5 pesos por segundo)
    const costPerSecond = 6;
    const cuttingCost = cuttingTime * costPerSecond;

    // Mostrar el costo estimado en el span
    document.getElementById("cuttingCost").textContent = cuttingCost.toFixed(2);


    // Área total de la tabla y costo por mm²
    const tableArea = 1830 * 2600; // mm²
    const costPerSquareMm = 18000 / tableArea;

    // Calcular el costo del material utilizado
    const materialCost = totalArea * costPerSquareMm;

    const porcentajeDeAumento = 0.65;

    let costoFinalMaterial = materialCost + (materialCost * porcentajeDeAumento)


    // Mostrar el costo estimado del material
    document.getElementById("materialCost").textContent = costoFinalMaterial.toFixed(2);

    let ValorFinalProducto = (costoFinalMaterial + cuttingCost) * 1.75;

    // Mostrar el costo estimado del material
    document.getElementById("CajaCost").textContent = ValorFinalProducto.toFixed(2);
    


}

// Escuchar el evento de cambio en el checkbox "Con tapa" para actualizar la caja automáticamente
document.getElementById("withLid").addEventListener("change", () => {
    create2DBox();
});

// Función para exportar el diseño como SVG
document.getElementById('downloadSVG').addEventListener('click', () => {
    const svgData = paper.project.exportSVG({ asString: true });
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plano_caja.svg';
    link.click();
});

// Escuchar el evento de envío del formulario para generar el diseño en 2D
document.getElementById('boxForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const depth = parseFloat(document.getElementById("depth").value);
    const thickness = parseFloat(document.getElementById("thickness").value);
    const withLid = document.getElementById("withLid").checked;

    create2DBox(width, height, depth, thickness, withLid);

    
});
