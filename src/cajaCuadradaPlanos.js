// Seleccionar el contenedor SVG en el canvas de designCanvas
const designCanvas = document.getElementById('designCanvas');
paper.setup(designCanvas);

// Función para crear el plano de la caja en 2D usando milímetros
function create2DBox(width, height, depth, thickness) {
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
        size: [width  * scale, height * scale],
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
            trasera.bounds.left - (encastreSideWidthTrasera * scale), // Posición en el borde derecho de 'trasera'
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
            trasera.bounds.right, // Posición en el borde derecho de 'trasera'
            trasera.bounds.center.y - (encastreSideHeightTrasera * scale) / 2 // Centrado en el eje Y de 'trasera'
        ],
        size: [encastreSideWidthTrasera * scale + overlap, encastreSideHeightTrasera * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Operaciones booleanas para unir los encastres a la parte trasera
    let traseraWithBottom = trasera.subtract(encastreBottomTrasera);
    let traseraWithBottomLeft = traseraWithBottom.unite(encastreLeftTrasera);
    let finalTrasera = traseraWithBottomLeft.unite(encastreRightTrasera);

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
        size: [width  * scale, height * scale],
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
            delantera.bounds.left - (encastreSideWidthTrasera * scale),// Posición en el borde derecho de 'trasera'
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
            delantera.bounds.right , // Posición en el borde derecho de 'trasera'
            delantera.bounds.center.y - (encastreSideHeightTrasera * scale) / 2 // Centrado en el eje Y de 'trasera'
        ],
        size: [encastreSideWidthTrasera * scale + overlap, encastreSideHeightTrasera * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    // Operaciones booleanas para unir los encastres a la parte delantera
    let delanteraWithBottom = delantera.subtract(encastreBottomDelantera);
    let delanteraWithBottomLeft = delanteraWithBottom.unite(encastreLeftDelantera);
    let finalDelantera = delanteraWithBottomLeft.unite(encastreRightDelantera);

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
        size: [(depth + 6) * scale, height * scale],
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
            izquierda.bounds.left,
            izquierda.bounds.center.y - (encastreSideHeightLateraleslat * scale) / 2 // Centrado en el eje Y de 'izquierda'
        ],
        size: [encastreSideWidthLaterales * scale + overlap, encastreSideHeightLateraleslat * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

        // Encastre visagra en el eje Y de 'izquierda'
    const encastrevisagraLeftIzquierda = new paper.Path.Rectangle({
        point: [
            izquierda.bounds.left,
            izquierda.bounds.top - (6.5*scale) // Centrado en el eje Y de 'izquierda'
        ],
        size: [12 * scale, 10 * scale],
        strokeColor: 'red',
        strokeWidth: 1,
        fillColor: null,
        radius: 3
    });

    const centerVisagraLeftIzquierda = encastrevisagraLeftIzquierda.bounds.center;  

    const redondoVisagraLeftIzquierda = new paper.Path.Ellipse({
        center: centerVisagraLeftIzquierda,
        size : [(5.5 * scale), (5.5 * scale)],
        strokeColor: 'red',
        strokeWidth: 1,
        fillColor: null,

    })
    // Encastre derecho en el eje Y de 'izquierda'
    const encastreRightIzquierda = new paper.Path.Rectangle({
        point: [
            izquierda.bounds.right - (encastreSideWidthLaterales * scale),
            izquierda.bounds.center.y - (encastreSideHeightLateraleslat * scale) / 2 // Centrado en el eje Y de 'izquierda'
        ],
        size: [encastreSideWidthLaterales * scale + overlap, encastreSideHeightLateraleslat  * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

// operaciones booleanas para unir estos encastres a la figura 'izquierda'
    let izquierdaWithBottom = izquierda.subtract(encastreBottomIzquierda);
    let izquierdaWithLeft = izquierdaWithBottom.subtract(encastreLeftIzquierda);
    let izquierdaWithEncastreVisagra = izquierdaWithLeft.unite(encastrevisagraLeftIzquierda);
    let izquierdaWithRedondoVisagra = izquierdaWithEncastreVisagra.subtract(encastreRightIzquierda);
    let finalIzquierda = izquierdaWithRedondoVisagra.subtract(redondoVisagraLeftIzquierda);
    
// Eliminar los objetos de encastres y la figura 'izquierda' después de la unión si decides hacer las operaciones booleanas
    izquierda.remove();
    encastreBottomIzquierda.remove();
    encastreLeftIzquierda.remove();
    encastrevisagraLeftIzquierda.remove();
    encastreRightIzquierda.remove();
    redondoVisagraLeftIzquierda.remove();
    izquierdaWithBottom.remove();   
    izquierdaWithLeft.remove();
    izquierdaWithEncastreVisagra.remove();
    izquierdaWithRedondoVisagra.remove();
    finalIzquierda.strokeColor = 'black';

    
    // Crear la figura derecha
    const derecha = new paper.Path.Rectangle({
        point: [izquierda.bounds.right + spacing, izquierda.bounds.top],
        size: [(depth + 6) * scale, height * scale],
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
            derecha.bounds.left, // Posición en el borde izquierdo de 'derecha'
            derecha.bounds.center.y - (encastreSideHeightLateraleslat * scale) / 2 // Centrado en el eje Y de 'derecha'
        ],
        size: [encastreSideWidthLaterales * scale + overlap, encastreSideHeightLateraleslat * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

    const encastrevisagraLeftDerecha = new paper.Path.Rectangle({
        point: [
            derecha.bounds.left,
            derecha.bounds.top - (6.5*scale) // Centrado en el eje Y de 'izquierda'
        ],
        size: [12 * scale, 10 * scale],
        strokeColor: 'red',
        strokeWidth: 1,
        fillColor: null,
        radius: 3
    });

    const centerVisagraLeftDerecha = encastrevisagraLeftDerecha.bounds.center;  

    const redondoVisagraLeftDerecha = new paper.Path.Ellipse({
        center: centerVisagraLeftDerecha,
        size : [(5.5 * scale), (5.5 * scale)],
        strokeColor: 'red',
        strokeWidth: 1,
        fillColor: null,

    })


    // Encastre derecho en el eje Y de 'derecha'
    const encastreRightDerecha = new paper.Path.Rectangle({
        point: [
            derecha.bounds.right - (encastreSideWidthLaterales * scale + overlap) , // Posición en el borde derecho de 'derecha'
            derecha.bounds.center.y - (encastreSideHeightLateraleslat * scale) / 2 // Centrado en el eje Y de 'derecha'
        ],
        size: [encastreSideWidthLaterales * scale + overlap, encastreSideHeightLateraleslat  * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });

// operaciones booleanas para unir estos encastres a la figura 'derecha'
    let derechaWithEncastreVisagra = derecha.unite(encastrevisagraLeftDerecha);
    let derechaConRedondoVisagra = derechaWithEncastreVisagra.subtract(redondoVisagraLeftDerecha);
    let derechaWithBottom = derechaConRedondoVisagra.subtract(encastreBottomDerecha);
    let derechaWithLeft = derechaWithBottom.subtract(encastreLeftDerecha);
    let finalDerecha = derechaWithLeft.subtract(encastreRightDerecha);

// Eliminar los objetos de encastres y la figura 'derecha' después de la unión si decides hacer las operaciones booleanas
    derecha.remove();
    encastrevisagraLeftDerecha.remove();
    redondoVisagraLeftDerecha.remove();
    encastreBottomDerecha.remove();
    encastreLeftDerecha.remove();
    encastreRightDerecha.remove();
    derechaWithBottom.remove();
    derechaWithLeft.remove();
    derechaWithEncastreVisagra.remove();
    derechaConRedondoVisagra.remove();
    finalDerecha.strokeColor = 'black';

//TAPA
// Tamaño de la tapa, 3.5 mm extra en cada lado (7 mm en total)
    const lidWidth = width+6;
    const lidDepth = depth+3.5;

    const encastreWidthTP = lidWidth;
    const encastreHeightTP = thickness + 1 ;
    
    const encastreSideHeightTP = 15;
    const encastreSideWidthTP = thickness;

    // Crear la base de la tapa con el tamaño ajustado
    const tapaBase = new paper.Path.Rectangle({
        point: [derecha.bounds.right + spacing, derecha.bounds.top],
        size: [lidWidth * scale, lidDepth * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null,
        radius: 0.5 * scale
    });

    
    // Encastre superior
    const encastreTopTP = new paper.Path.Rectangle({
        point: [
            tapaBase.bounds.center.x - (encastreWidthTP * scale) / 2,
            tapaBase.bounds.top //- (encastreHeightTP * scale + overlap)
            ],
        size: [(encastreWidthTP) * scale, encastreHeightTP * scale + overlap],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null,
        radius: 1.5 * scale
        });
    

    
    
    // Encastre izquierdo
    const encastreLeftTP = new paper.Path.Rectangle({
        point:[            
        tapaBase.bounds.left, // Posición en el borde izquierdo de 'izquierda'
        tapaBase.bounds.top,
        ],
        size: [encastreSideWidthTP * scale + overlap, encastreSideHeightTP * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });
    
    // Encastre derecho
    const encastreRightTP = new paper.Path.Rectangle({
        point:[            
            tapaBase.bounds.right - (encastreSideWidthTP * scale + overlap), // Posición en el borde izquierdo de 'izquierda'
            tapaBase.bounds.top,
            ],
        size: [encastreSideWidthTP * scale + overlap, encastreSideHeightTP * scale],
        strokeColor: 'black',
        strokeWidth: 1,
        fillColor: null
    });
        
    // Operaciones booleanas para unir los encastres a la tapa base
    

    let baseWithTopBottomLeftTP = tapaBase.subtract(encastreLeftTP);
    let baseWithTopTP = baseWithTopBottomLeftTP.subtract(encastreRightTP);
    let  finalBaseTP= baseWithTopTP.unite(encastreTopTP);
    
    // Eliminar los objetos de encastres y la base original después de la unión
    tapaBase.remove();
    encastreTopTP.remove();

    encastreLeftTP.remove();
    encastreRightTP.remove();
    baseWithTopTP.remove();
 
    baseWithTopBottomLeftTP.remove();
    
    // Asignar el color de borde al resultado final
    finalBaseTP.strokeColor = 'black';    

    // Calcular la longitud total del contorno
    let totalLength = 0;


    // Sumar la longitud de cada figura final
    totalLength += finalBase.length;
    totalLength += finalTrasera.length;
    totalLength += finalDelantera.length;
    totalLength += finalIzquierda.length;
    totalLength += finalDerecha.length;
    totalLength += finalBaseTP.length;

    // Calcular el área total de las piezas de la caja
    let totalArea = 0;

    // Agregar las áreas de cada pieza
    totalArea += width * depth; // Base
    totalArea += width * height; // Trasera
    totalArea += width * height; // Delantera
    totalArea += depth * height; // Lateral derecho
    totalArea += depth * height; // Lateral izquierdo
    totalArea += lidWidth * lidDepth; //base tapa


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
    const costPerSquareMm = 14347 / tableArea;

    // Calcular el costo del material utilizado
    const materialCost = totalArea * costPerSquareMm;

    const porcentajeDeAumento = 0.80;

    let costoFinalMaterial = materialCost + (materialCost * porcentajeDeAumento)


    // Mostrar el costo estimado del material
    document.getElementById("materialCost").textContent = costoFinalMaterial.toFixed(2);

    let ValorFinalProducto = (costoFinalMaterial + cuttingCost) * 1.75;

    // Mostrar el costo estimado del material
    document.getElementById("CajaCost").textContent = ValorFinalProducto.toFixed(2);
    

}

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


    create2DBox(width, height, depth, thickness );

    
});
