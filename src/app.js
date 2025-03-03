// Obtener el lienzo y crear el motor de Babylon
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Variable global para almacenar la tapa, si es creada
let baseTapa;
let encastreBaseTapaDelante;
let encastreBaseTapaTrasero;
let encastreBaseTapaIzquierdo;
let encastreBaseTapaDerecho;

let delanteraTapa;
let encastreBaseLateralTapaDelante;
let encastreIzqSupTapDelante;
let encastreIzqinfTapDelante;
let encastreDerSupTapDelante;
let encastreDerinfTapDelante;

let traseraTapa;
let encastreBaseLateralTapaTrasero;
let encastreIzqSupTapTrasero;
let encastreIzqinfTapTrasero;
let encastreDerSupTapTrasero;
let encastreDerinfTapTrasero;

let izquierdaTapa;
let encastreBaseLateralTapaIzquierdo;
let encastreIzqTapIzquierda;
let encastreDerTapIzquierda;

let derechaTapa;
let encastreBaseLateralTapaDerecho;
let encastreIzqTapDerecha;
let encastreDerTapDerecha;


// Crear animación para la tapa
const animateLid = (lidMesh, scene) => {
    // Crear la animación de posición en el eje Y
    const animation = new BABYLON.Animation("lidAnimation", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // Definir los fotogramas clave de la animación
    const keys = [];
    const originalY = lidMesh.position.y;
    keys.push({ frame: 0, value: originalY });              // Posición inicial
    keys.push({ frame: 15, value: originalY + 0.2 });       // Subir la tapa (ajusta 0.1 según sea necesario)
    keys.push({ frame: 30, value: originalY });             // Volver a la posición original

    // Asignar los fotogramas clave a la animación
    animation.setKeys(keys);

    // Añadir la animación al mesh
    lidMesh.animations = [animation];

    // Iniciar la animación en bucle infinito
    scene.beginAnimation(lidMesh, 0, 30, true, 0.5); // Cambiado a true para que sea infinita
};


// Crear la escena de Babylon.js
const createScene = (width, height, depth, thickness, withLid) => {
    const scene = new BABYLON.Scene(engine);
    
    // Cambiar el color de fondo de la escena
    scene.clearColor = new BABYLON.Color3.FromHexString("#f2f2f2");

    // Configuración de cámara y luz
    const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Ajustar el zoom con la rueda del ratón
    camera.wheelPrecision = 45;
    camera.minZ = 0.1; // Para evitar recortes al acercarse

    // Función para ajustar la distancia de la cámara en función del tamaño de la caja
    function adjustCameraDistance(width, height, depth) {
        const maxDimension = Math.max(width, height, depth);
        camera.radius = maxDimension * 2.8; // Ajusta el factor según lo necesites
    }

    // Llama a la función `adjustCameraDistance` después de crear la caja
    adjustCameraDistance(width, height, depth);
    
    // Luz ambiente y luz hemisférica para mejorar la iluminación
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 1.2; // Ajuste de intensidad para más claridad

    const directionalLight = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(0.5, -1, -0.5), scene); // Cambia la dirección de la luz
    directionalLight.intensity = 0.7; // Ajuste de intensidad

    // Añadir una luz de relleno para reducir sombras
    const fillLight = new BABYLON.PointLight("fillLight", new BABYLON.Vector3(0, 1, -5), scene);
    fillLight.intensity = 0.4; // Luz más suave para iluminación adicional

    // Crear material de madera con ajustes para hacerlo más claro
    const material = new BABYLON.StandardMaterial("woodMaterial", scene);
    material.diffuseTexture = new BABYLON.Texture("/src/img/Wood037_2K-JPG_Color.jpg", scene);
    material.diffuseTexture.level = 1.5;
    material.bumpTexture = new BABYLON.Texture("/src/img/Wood037_2K-JPG_NormalGL.jpg", scene);
    material.roughness = 1;
    material.metallic = 0;
    material.diffuseColor = new BABYLON.Color3(1, 0.9, 0.75);

    ///////////////////////////////////////////////////////////////////
    // Crear materiales con diferencias de color más notables para cada cara y menos rugosidad
    const materialDelantera = new BABYLON.StandardMaterial("materialDelantera", scene);
    materialDelantera.diffuseTexture = new BABYLON.Texture("/src/img/Wood037_2K-JPG_Color.jpg", scene);
    materialDelantera.diffuseColor = new BABYLON.Color3(1, 0.85, 0.7);
    materialDelantera.roughness = 0.5;

    const materialBack = new BABYLON.StandardMaterial("materialBack", scene);
    materialBack.diffuseTexture = new BABYLON.Texture("/src/img/Wood037_2K-JPG_Color.jpg", scene);
    materialBack.diffuseColor = new BABYLON.Color3(0.95, 0.8, 0.65);
    materialBack.roughness = 0.5;

    const materialIzquierda = new BABYLON.StandardMaterial("materialIzquierda", scene);
    materialIzquierda.diffuseTexture = new BABYLON.Texture("/src/img/Wood037_2K-JPG_Color.jpg", scene);
    materialIzquierda.diffuseColor = new BABYLON.Color3(0.9, 0.75, 0.6);
    materialIzquierda.roughness = 0.5;

    const materialDerecha = new BABYLON.StandardMaterial("materialDerecha", scene);
    materialDerecha.diffuseTexture = new BABYLON.Texture("/src/img/Wood037_2K-JPG_Color.jpg", scene);
    materialDerecha.diffuseColor = new BABYLON.Color3(0.9, 0.75, 0.6);
    materialDerecha.roughness = 0.5;

    const materialBase = new BABYLON.StandardMaterial("materialBase", scene);
    materialBase.diffuseTexture = new BABYLON.Texture("/src/img/Wood037_2K-JPG_Color.jpg", scene);
    materialBase.diffuseColor = new BABYLON.Color3(0.9, 0.75, 0.6);
    materialBase.roughness = 0.5;
    ///////////////////////////////////////////////////////////////////

    //crear la parte delantera de la caja
    const delantera = BABYLON.MeshBuilder.CreateBox("delantera", { width, height: height, depth: thickness }, scene);
    delantera.position.y = -thickness;
    delantera.position.z = depth/2 + thickness/2;
    delantera.material = material;

    // Crear un encastre inferior delantera centrado
    const encastraseroInferiordelantera = BABYLON.MeshBuilder.CreateBox("encastraseroInferiordelantera", {
        width: width * 0.5,
        height: thickness ,
        depth: thickness
    }, scene);
    encastraseroInferiordelantera.position.y = -height / 2 - thickness/2;
    encastraseroInferiordelantera.position.z = depth/2 + thickness/2;

    // Crear encastres laterales izquierdo y derecho, centrados verticalmente
    const encastreIzqDelantera = BABYLON.MeshBuilder.CreateBox("encastreIzqDelantera", {
        width: thickness,
        height: height * 0.5,
        depth: thickness
    }, scene);
    encastreIzqDelantera.position.x = -width / 2 - thickness / 2;
    encastreIzqDelantera.position.y = -thickness;
    encastreIzqDelantera.position.z = +depth/2 + thickness/2;
    
    const encastreDerDelantera = BABYLON.MeshBuilder.CreateBox("encastreDerDelantera", {
        width: thickness,
        height: height * 0.5,
        depth: thickness
    }, scene);
    encastreDerDelantera.position.x = width / 2 + thickness / 2;
    encastreDerDelantera.position.y = -thickness;
    encastreDerDelantera.position.z = +depth/2 + thickness/2;

    // Crear la parte trasera de la caja con altura ajustada
    const back = BABYLON.MeshBuilder.CreateBox("back", { width, height: height, depth: thickness }, scene);
    back.position.y = -thickness;
    back.position.z = -depth/2 - thickness/2;
    back.material = material;

    // Crear un encastre inferior centrado
    const encastraseroInferior = BABYLON.MeshBuilder.CreateBox("encastraseroInferior", {
        width: width * 0.5,
        height: thickness,
        depth: thickness
    }, scene);
    encastraseroInferior.position.y = -height / 2 - thickness / 2;
    encastraseroInferior.position.z = -depth/2 - thickness/2;


    // Crear encastres laterales izquierdo y derecho, centrados verticalmente
    const encastreIzq = BABYLON.MeshBuilder.CreateBox("encastreIzq", {
        width: thickness,
        height: height * 0.5,
        depth: thickness
    }, scene);
    encastreIzq.position.x = -width / 2 - thickness / 2;
    encastreIzq.position.y = -thickness;
    encastreIzq.position.z = -depth/2 - thickness/2;

    const encastreDer = BABYLON.MeshBuilder.CreateBox("encastreDer", {
        width: thickness,
        height: height * 0.5,
        depth: thickness
    }, scene);
    encastreDer.position.x = width / 2 + thickness / 2;
    encastreDer.position.y = -thickness;
    encastreDer.position.z = -depth/2 - thickness/2;

    //crear lado izquierdo de la caja
    const caraIzquierda = BABYLON.MeshBuilder.CreateBox("caraIzquierda", {width: thickness, height: height, depth: depth }, scene);
    caraIzquierda.position.x = width / 2 + thickness / 2;
    caraIzquierda.position.y = -thickness;
    caraIzquierda.position.z = 0;
    caraIzquierda.material = material;

    // Crear un encastre inferior IZQUIERDO centrado
    const encastraseroInferiorCaraIzquierda = BABYLON.MeshBuilder.CreateBox("encastraseroInferiorCaraIzquierda", {
        width: thickness,
        height: thickness,
        depth: depth * 0.5
    }, scene);
    encastraseroInferiorCaraIzquierda.position.x = width / 2 + thickness / 2;
    encastraseroInferiorCaraIzquierda.position.y = -height / 2 - thickness / 2;
    encastraseroInferiorCaraIzquierda.position.z = 0;

    //const Encastre superior lado izquierdo de la caja
    const encastreSuperiorCaraIzquierda = BABYLON.MeshBuilder.CreateBox("encastreSuperiorCaraIzquierda", {width: thickness, height: height * 0.25, depth: thickness }, scene);
    encastreSuperiorCaraIzquierda.position.x = width / 2 + thickness / 2;
    encastreSuperiorCaraIzquierda.position.y = (height / 2 - (height * 0.25) / 2) - thickness;  
    encastreSuperiorCaraIzquierda.position.z = -depth/2 - thickness/2;
    encastreSuperiorCaraIzquierda.material = material;

    //const Encastre inferior lado izquierdo de la caja
    const encastreInferiorCaraIzquierda = BABYLON.MeshBuilder.CreateBox("encastreInferiorCaraIzquierda", {width: thickness, height: height * 0.25, depth: thickness }, scene);
    encastreInferiorCaraIzquierda.position.x = width / 2 + thickness / 2;
    encastreInferiorCaraIzquierda.position.y = -(height / 2 - (height * 0.25) / 2) - thickness;  
    encastreInferiorCaraIzquierda.position.z = -depth/2 - thickness/2;
    encastreInferiorCaraIzquierda.material = material;

    //const Encastre superior 2 lado izquierdo de la caja
    const encastreSuperiorCaraIzquierda2 = BABYLON.MeshBuilder.CreateBox("encastreSuperiorCaraIzquierda2", {width: thickness, height: height * 0.25, depth: thickness }, scene);
    encastreSuperiorCaraIzquierda2.position.x = width / 2 + thickness / 2;
    encastreSuperiorCaraIzquierda2.position.y = (height / 2 - (height * 0.25) / 2) - thickness;  
    encastreSuperiorCaraIzquierda2.position.z = +depth/2 + thickness/2;
    encastreSuperiorCaraIzquierda2.material = material;

    //const Encastre inferior 2 lado izquierdo de la caja
    const encastreInferiorCaraIzquierda2 = BABYLON.MeshBuilder.CreateBox("encastreInferiorCaraIzquierda2", {width: thickness, height: height * 0.25, depth: thickness }, scene);
    encastreInferiorCaraIzquierda2.position.x = width / 2 + thickness / 2;
    encastreInferiorCaraIzquierda2.position.y = -(height / 2 - (height * 0.25) / 2) - thickness;  
    encastreInferiorCaraIzquierda2.position.z = +depth/2 + thickness/2;
    encastreInferiorCaraIzquierda2.material = material;    

    //crear lado Derecho de la caja
    const caraDerecha = BABYLON.MeshBuilder.CreateBox("caraIzquierda", {width: thickness, height: height, depth: depth }, scene);
    caraDerecha.position.x = -width / 2 + -thickness / 2;
    caraDerecha.position.y = -thickness;
    caraDerecha.position.z = 0;
    caraDerecha.material = material;

    // Crear un encastre inferior DERECHO centrado
    const encastraseroInferiorCaraDerecho = BABYLON.MeshBuilder.CreateBox("encastraseroInferiorCaraIzquierda", {
        width: thickness,
        height: thickness,
        depth: depth * 0.5
    }, scene);
    encastraseroInferiorCaraDerecho.position.x = -width / 2 + -thickness / 2;
    encastraseroInferiorCaraDerecho.position.y = -height / 2 - thickness / 2;
    encastraseroInferiorCaraDerecho.position.z = 0;    

    //const Encastre superior lado izquierdo de la caja
    const encastreSuperiorCaraDerecha = BABYLON.MeshBuilder.CreateBox("encastreSuperiorCaraDerecha", {width: thickness, height: height * 0.25, depth: thickness }, scene);
    encastreSuperiorCaraDerecha.position.x = -width / 2 + -thickness / 2;
    encastreSuperiorCaraDerecha.position.y = (height / 2 - (height * 0.25) / 2) - thickness;  
    encastreSuperiorCaraDerecha.position.z = -depth/2 - thickness/2;
    encastreSuperiorCaraDerecha.material = material;

    //const Encastre inferior lado izquierdo de la caja
    const encastreInferiorCaraDerecha = BABYLON.MeshBuilder.CreateBox("encastreInferiorCaraDerecha", {width: thickness, height: height * 0.25, depth: thickness }, scene);
    encastreInferiorCaraDerecha.position.x = -width / 2 + -thickness / 2;
    encastreInferiorCaraDerecha.position.y = -(height / 2 - (height * 0.25) / 2) - thickness;  
    encastreInferiorCaraDerecha.position.z = -depth/2 - thickness/2;
    encastreInferiorCaraDerecha.material = material;

    //const Encastre superior 2 lado izquierdo de la caja
    const encastreSuperiorCaraDerecha2 = BABYLON.MeshBuilder.CreateBox("encastreSuperiorCaraDerecha2", {width: thickness, height: height * 0.25, depth: thickness }, scene);
    encastreSuperiorCaraDerecha2.position.x = -width / 2 + -thickness / 2;
    encastreSuperiorCaraDerecha2.position.y = (height / 2 - (height * 0.25) / 2) - thickness;  
    encastreSuperiorCaraDerecha2.position.z = +depth/2 + thickness/2;
    encastreSuperiorCaraDerecha2.material = material;

    //const Encastre inferior 2 lado izquierdo de la caja
    const encastreInferiorCaraDerecha2 = BABYLON.MeshBuilder.CreateBox("encastreInferiorCaraDerecha2", {width: thickness, height: height * 0.25, depth: thickness }, scene);
    encastreInferiorCaraDerecha2.position.x = -width / 2 + -thickness / 2;
    encastreInferiorCaraDerecha2.position.y = -(height / 2 - (height * 0.25) / 2) - thickness;  
    encastreInferiorCaraDerecha2.position.z = +depth/2 + thickness/2;
    encastreInferiorCaraDerecha2.material = material;   
    
    // Crear la base inferior de la caja
    const base = BABYLON.MeshBuilder.CreateBox("base", { width, height: thickness, depth: depth }, scene);
    base.position.y = -height / 2 - thickness/2; // Colocar la base debajo de las paredes
    base.material = material;

    // Crear un encastre inferior delantera de base centrado
    const encastraseroInferiorDelanteraBase = BABYLON.MeshBuilder.CreateBox("encastraseroInferiorDelanteraBase", {
        width: width * 0.5,
        height: thickness,
        depth: thickness  
    }, scene);
    encastraseroInferiorDelanteraBase.position.y = -height / 2 - thickness/2;
    encastraseroInferiorDelanteraBase.position.z = depth/2 + thickness/2;
    encastraseroInferiorDelanteraBase.material = material;

    // Crear un encastre inferior TRASERA BASE centrado
    const encastraseroInferiorTraseroBase = BABYLON.MeshBuilder.CreateBox("encastraseroInferiorTraseroBase", {
        width: width * 0.5,
        height: thickness,
        depth: thickness
    }, scene);
    encastraseroInferiorTraseroBase.position.y = -height / 2 - thickness / 2;
    encastraseroInferiorTraseroBase.position.z = -depth/2 - thickness/2;
    encastraseroInferiorTraseroBase.material = material;

    // Crear un encastre inferior izquierdo centrado base
    const encastraseroInferiorCaraIzquierdaBase = BABYLON.MeshBuilder.CreateBox("encastraseroInferiorCaraIzquierdaBase", {
        width: thickness,
        height: thickness,
        depth: depth * 0.5
    }, scene);
    encastraseroInferiorCaraIzquierdaBase.position.x = width / 2 + thickness / 2;
    encastraseroInferiorCaraIzquierdaBase.position.y = -height / 2 - thickness / 2;
    encastraseroInferiorCaraIzquierdaBase.position.z = 0;    
    encastraseroInferiorCaraIzquierdaBase.material = material;
    // Crear un encastre inferior derecho centrado base
    const encastraseroInferiorCaraDerechoBase = BABYLON.MeshBuilder.CreateBox("encastraseroInferiorCaraDerechoBase", {
        width: thickness,
        height: thickness,
        depth: depth * 0.5
    }, scene);
    encastraseroInferiorCaraDerechoBase.position.x = -width / 2 + -thickness / 2;
    encastraseroInferiorCaraDerechoBase.position.y = -height / 2 - thickness / 2;
    encastraseroInferiorCaraDerechoBase.position.z = 0;
    encastraseroInferiorCaraDerechoBase.material = material;


    // Realizar operaciones booleanas
    const delanteraCSG = BABYLON.CSG.FromMesh(delantera);
    const subtractCSGencastreInferiorDelantero = BABYLON.CSG.FromMesh(encastraseroInferiordelantera);
    const encastreIzqdelanteraCSG = BABYLON.CSG.FromMesh(encastreIzqDelantera);
    const encastreDerdelanteraCSG = BABYLON.CSG.FromMesh(encastreDerDelantera);

    const backCSG = BABYLON.CSG.FromMesh(back);
    const subtractCSG = BABYLON.CSG.FromMesh(encastraseroInferior);
    const encastreIzqCSG = BABYLON.CSG.FromMesh(encastreIzq);
    const encastreDerCSG = BABYLON.CSG.FromMesh(encastreDer);

    const caraIzquierdaCSG = BABYLON.CSG.FromMesh(caraIzquierda);
    const encastraseroInferiorCaraIzquierdaCSG = BABYLON.CSG.FromMesh(encastraseroInferiorCaraIzquierda);
    const encastreSuperiorCaraIzquierdaSCG = BABYLON.CSG.FromMesh(encastreSuperiorCaraIzquierda);
    const encastreInferiorCaraIzquierdaSCG = BABYLON.CSG.FromMesh(encastreInferiorCaraIzquierda);
    const encastreSuperiorCaraIzquierda2SCG = BABYLON.CSG.FromMesh(encastreSuperiorCaraIzquierda2);
    const encastreInferiorCaraIzquierda2SCG = BABYLON.CSG.FromMesh(encastreInferiorCaraIzquierda2);

    const caraDerechaCSG = BABYLON.CSG.FromMesh(caraDerecha);
    const encastraseroInferiorCaraDerechoCSG = BABYLON.CSG.FromMesh(encastraseroInferiorCaraDerecho);
    const encastreSuperiorCaraDerechaSCG = BABYLON.CSG.FromMesh(encastreSuperiorCaraDerecha);
    const encastreInferiorCaraDerechaSCG = BABYLON.CSG.FromMesh(encastreInferiorCaraDerecha);
    const encastreSuperiorCaraDerecha2SCG = BABYLON.CSG.FromMesh(encastreSuperiorCaraDerecha2);
    const encastreInferiorCaraDerecha2SCG = BABYLON.CSG.FromMesh(encastreInferiorCaraDerecha2);

    const baseCSG = BABYLON.CSG.FromMesh(base);
    const encastraseroInferiorDelanteraBaseCSG = BABYLON.CSG.FromMesh(encastraseroInferiorDelanteraBase);
    const encastraseroInferiorTraseroBaseCSG = BABYLON.CSG.FromMesh(encastraseroInferiorTraseroBase);
    const encastraseroInferiorCaraIzquierdaBaseCSG = BABYLON.CSG.FromMesh(encastraseroInferiorCaraIzquierdaBase);
    const encastraseroInferiorCaraDerechoBaseCSG = BABYLON.CSG.FromMesh(encastraseroInferiorCaraDerechoBase);

    const delanteraWithHoleCSG = delanteraCSG.subtract(subtractCSGencastreInferiorDelantero).union(encastreIzqdelanteraCSG).union(encastreDerdelanteraCSG);

    const backWithHoleCSG = backCSG.subtract(subtractCSG).union(encastreIzqCSG).union(encastreDerCSG);

    const izquierdaWithHoleCSG = caraIzquierdaCSG.subtract(encastraseroInferiorCaraIzquierdaCSG).union(encastreSuperiorCaraIzquierdaSCG).union(encastreInferiorCaraIzquierdaSCG).union(encastreSuperiorCaraIzquierda2SCG).union(encastreInferiorCaraIzquierda2SCG);

    const derechaWithHoleCSG = caraDerechaCSG.subtract(encastraseroInferiorCaraDerechoCSG).union(encastreSuperiorCaraDerechaSCG).union(encastreInferiorCaraDerechaSCG).union(encastreSuperiorCaraDerecha2SCG).union(encastreInferiorCaraDerecha2SCG);

    const baseWithHoleCSG = baseCSG.union(encastraseroInferiorDelanteraBaseCSG).union(encastraseroInferiorTraseroBaseCSG).union(encastraseroInferiorCaraIzquierdaBaseCSG).union(encastraseroInferiorCaraDerechoBaseCSG);

    const finalDelantera = delanteraWithHoleCSG.toMesh("finalDelantera", material, scene);   

    const finalBack = backWithHoleCSG.toMesh("finalBack", material, scene);

    const finalIzquierda = izquierdaWithHoleCSG.toMesh("finalIzquierda", material , scene);

    const finalDerecha = derechaWithHoleCSG.toMesh("finalDerecha", material , scene);

    const finalBase = baseWithHoleCSG.toMesh("finalBase", material , scene);
    

    // Recalcular normales para mejorar el renderizado
    finalDelantera.updateFacetData();
    //finalDelantera.material = material;


    finalBack.updateFacetData();
    //finalBack.material = material;


    finalIzquierda.updateFacetData();
   // finalIzquierda.material = material;


    finalDerecha.updateFacetData();
    //finalDerecha.material = material;


    finalBase.updateFacetData();
    //finalBase.material = material;

    // Asignar los materiales a las diferentes partes de la caja
    finalDelantera.material = materialDelantera;
    finalBack.material = materialBack;
    finalIzquierda.material = materialIzquierda;
    finalDerecha.material = materialDerecha;
    finalBase.material = materialBase;

    // Eliminar mallas temporales
    delantera.dispose();
    encastraseroInferiordelantera.dispose();
    encastreIzqDelantera.dispose();
    encastreDerDelantera.dispose();

    back.dispose();
    encastraseroInferior.dispose();
    encastreIzq.dispose();
    encastreDer.dispose();

    caraIzquierda.dispose();
    encastraseroInferiorCaraIzquierda.dispose();
    encastreSuperiorCaraIzquierda.dispose();
    encastreInferiorCaraIzquierda.dispose();
    encastreSuperiorCaraIzquierda2.dispose();
    encastreInferiorCaraIzquierda2.dispose();

    caraDerecha.dispose();
    encastraseroInferiorCaraDerecho.dispose();
    encastreSuperiorCaraDerecha.dispose();
    encastreInferiorCaraDerecha.dispose();
    encastreSuperiorCaraDerecha2.dispose();
    encastreInferiorCaraDerecha2.dispose();

    base.dispose();
    encastraseroInferiorDelanteraBase.dispose();
    encastraseroInferiorTraseroBase.dispose();
    encastraseroInferiorCaraIzquierdaBase.dispose();
    encastraseroInferiorCaraDerechoBase.dispose();

    // Solo crear la tapa si `withLid` es verdadero
    if (withLid) {
        baseTapa = BABYLON.MeshBuilder.CreateBox("baseTapa", { width: (width + (thickness*2) + 0.015 )  , height: thickness, depth: (depth + (thickness*2) + 0.015 ) }, scene);
        baseTapa.position.y = height / 2 - thickness / 2; // Colocar la tapa en la parte superior
        baseTapa.material = material; // Asigna el material deseado para la tapa

        let depthOfBaseTapa = baseTapa.scaling.z * (depth + (thickness * 2) + 0.015);
        let widthOfBaseTapa = baseTapa.scaling.x * (width + (thickness*2) + 0.015);
        let posicionYbaseTata = baseTapa.position.y;
        
        // Crear un encastre delantera de tapa centrado
        encastreBaseTapaDelante = BABYLON.MeshBuilder.CreateBox("encastreBaseTapaDelante", {
            width: width * 0.5,
            height: thickness,
            depth: thickness  
        }, scene);
        encastreBaseTapaDelante.position.y = height / 2 - thickness / 2;
        encastreBaseTapaDelante.position.z = depthOfBaseTapa/2 + thickness/2;
        encastreBaseTapaDelante.material = material;

        // Crear un encastre trasero de tapa centrado 
        encastreBaseTapaTrasero = BABYLON.MeshBuilder.CreateBox("encastreBaseTapaTrasero", {
            width: width * 0.5,
            height: thickness,
            depth: thickness  
        }, scene);
        encastreBaseTapaTrasero.position.y = height / 2 - thickness / 2;
        encastreBaseTapaTrasero.position.z = -depthOfBaseTapa/2 - thickness/2;
        encastreBaseTapaTrasero.material = material;

        //Crear un encastre izquierdo de tapa centrado
        encastreBaseTapaIzquierdo = BABYLON.MeshBuilder.CreateBox("encastreBaseTapaIzquierdo", {
            width: thickness,
            height: thickness,
            depth: depth * 0.5
        }, scene);
        encastreBaseTapaIzquierdo.position.x = widthOfBaseTapa / 2 + thickness / 2;
        encastreBaseTapaIzquierdo.position.y = height / 2 - thickness / 2;
        encastreBaseTapaIzquierdo.position.z = 0;    
        encastreBaseTapaIzquierdo.material = material;

        //Crear un encastre derecho de tapa centrado
        encastreBaseTapaDerecho = BABYLON.MeshBuilder.CreateBox("encastreBaseTapaDerecho", {
            width: thickness,
            height: thickness,
            depth: depth * 0.5
        }, scene);
        encastreBaseTapaDerecho.position.x = -widthOfBaseTapa / 2 - thickness / 2;
        encastreBaseTapaDerecho.position.y = height / 2 - thickness / 2;
        encastreBaseTapaDerecho.position.z = 0;    
        encastreBaseTapaDerecho.material = material;



        //Crear lado delantero de la base de la caja
        delanteraTapa = BABYLON.MeshBuilder.CreateBox("delanteraTapa", { width: widthOfBaseTapa + (thickness*2), height: 0.15, depth: thickness }, scene);
        delanteraTapa.position.y = posicionYbaseTata - 0.06;
        delanteraTapa.position.z = depthOfBaseTapa/2 + thickness/2;
        delanteraTapa.material = material;

        //encastre lado delantero de la base 
        encastreBaseLateralTapaDelante = BABYLON.MeshBuilder.CreateBox("encastreBaseLateralTapaDelante", {
            width: width * 0.5,
            height: thickness,
            depth: thickness  
        }, scene);
        encastreBaseLateralTapaDelante.position.y = height / 2 - thickness / 2;
        encastreBaseLateralTapaDelante.position.z = depthOfBaseTapa/2 + thickness/2;
        encastreBaseLateralTapaDelante.material = material;
        //encastres lado izquierdo lado delantero caja
        encastreIzqSupTapDelante = BABYLON.MeshBuilder.CreateBox("encastreIzqSupTapDelante", {
            width: thickness,
            height: 0.0375,
            depth: thickness  
        }, scene);
        encastreIzqSupTapDelante.position.x = widthOfBaseTapa / 2 + thickness / 2;
        encastreIzqSupTapDelante.position.y = height / 2 - thickness/2 - (thickness*0.125);
        encastreIzqSupTapDelante.position.z = depthOfBaseTapa/2 + thickness/2;

        encastreIzqinfTapDelante = BABYLON.MeshBuilder.CreateBox("encastreIzqinfTapDelante", {
            width: thickness,
            height: 0.0375,
            depth: thickness  
        }, scene);
        encastreIzqinfTapDelante.position.x = widthOfBaseTapa / 2 + thickness / 2;
        encastreIzqinfTapDelante.position.y = height / 2 - (thickness*0.255) -(thickness*4.125);
        encastreIzqinfTapDelante.position.z = depthOfBaseTapa/2 + thickness/2;
        //encastres lado derecho lado delantero caja
        encastreDerSupTapDelante = BABYLON.MeshBuilder.CreateBox("encastreDerSupTapDelante", {
            width: thickness,
            height: 0.0375,
            depth: thickness  
        }, scene);
        encastreDerSupTapDelante.position.x = -widthOfBaseTapa / 2 - thickness / 2;
        encastreDerSupTapDelante.position.y = height / 2 - thickness/2 - (thickness*0.125);
        encastreDerSupTapDelante.position.z = depthOfBaseTapa/2 + thickness/2;

        encastreDerinfTapDelante = BABYLON.MeshBuilder.CreateBox("encastreDerinfTapDelante", {
            width: thickness,
            height: 0.0375,
            depth: thickness  
        }, scene);
        encastreDerinfTapDelante.position.x = -widthOfBaseTapa / 2 - thickness / 2;
        encastreDerinfTapDelante.position.y = height / 2 - (thickness*0.255) -(thickness*4.125);
        encastreDerinfTapDelante.position.z = depthOfBaseTapa/2 + thickness/2;

        
        

        //Crear lado trasero de la base de la caja
        traseraTapa = BABYLON.MeshBuilder.CreateBox("traseraTapa", { width: widthOfBaseTapa + (thickness*2), height: 0.15, depth: thickness }, scene);
        traseraTapa.position.y = posicionYbaseTata - 0.06;
        traseraTapa.position.z = -depthOfBaseTapa/2 - thickness/2;
        traseraTapa.material = material;
        
        //encastre lado trasero de tapa centrado 
        encastreBaseLateralTapaTrasero = BABYLON.MeshBuilder.CreateBox("encastreBaseLateralTapaTrasero", {
            width: width * 0.5,
            height: thickness,
            depth: thickness  
        }, scene);
        encastreBaseLateralTapaTrasero.position.y = height / 2 - thickness / 2;
        encastreBaseLateralTapaTrasero.position.z = -depthOfBaseTapa/2 - thickness/2;
        encastreBaseLateralTapaTrasero.material = material;
        //encastres lado izquierdo lado trasero caja
        encastreIzqSupTapTrasero = BABYLON.MeshBuilder.CreateBox("encastreIzqSupTapTrasero", {
            width: thickness,
            height: 0.0375,
            depth: thickness  
        }, scene);
        encastreIzqSupTapTrasero.position.x = widthOfBaseTapa / 2 + thickness / 2;
        encastreIzqSupTapTrasero.position.y = height / 2 - thickness/2 - (thickness*0.125);
        encastreIzqSupTapTrasero.position.z = -depthOfBaseTapa/2 - thickness/2;

        encastreIzqinfTapTrasero = BABYLON.MeshBuilder.CreateBox("encastreIzqinfTapTrasero", {
            width: thickness,
            height: 0.0375,
            depth: thickness  
        }, scene);
        encastreIzqinfTapTrasero.position.x = widthOfBaseTapa / 2 + thickness / 2;
        encastreIzqinfTapTrasero.position.y = height / 2 - (thickness*0.255) -(thickness*4.125);
        encastreIzqinfTapTrasero.position.z = -depthOfBaseTapa/2 - thickness/2;
        //encastres lado derecho lado trasero caja
        encastreDerSupTapTrasero = BABYLON.MeshBuilder.CreateBox("encastreDerSupTapTrasero", {
            width: thickness,
            height: 0.0375,
            depth: thickness  
        }, scene);
        encastreDerSupTapTrasero.position.x = -widthOfBaseTapa / 2 - thickness / 2;
        encastreDerSupTapTrasero.position.y = height / 2 - thickness/2 - (thickness*0.125);
        encastreDerSupTapTrasero.position.z = -depthOfBaseTapa/2 - thickness/2;

        encastreDerinfTapTrasero = BABYLON.MeshBuilder.CreateBox("encastreDerinfTapTrasero", {
            width: thickness,
            height: 0.0375,
            depth: thickness  
        }, scene);
        encastreDerinfTapTrasero.position.x = -widthOfBaseTapa / 2 - thickness / 2;
        encastreDerinfTapTrasero.position.y = height / 2 - (thickness*0.255) -(thickness*4.125);
        encastreDerinfTapTrasero.position.z = -depthOfBaseTapa/2 - thickness/2;




        //Crear lado izquierdo de la base de la caja  
        izquierdaTapa = BABYLON.MeshBuilder.CreateBox("izquierdaTapa", { width: thickness, height: 0.15, depth: depthOfBaseTapa + (thickness*2) }, scene);
        izquierdaTapa.position.x = widthOfBaseTapa / 2 + thickness / 2;
        izquierdaTapa.position.y = posicionYbaseTata - 0.06;
        izquierdaTapa.position.z = 0;
        izquierdaTapa.material = material;

        //Crear un encastre lado izquierdo de tapa centrado
        encastreBaseLateralTapaIzquierdo = BABYLON.MeshBuilder.CreateBox("encastreBaseLateralTapaIzquierdo", {
            width: thickness,
            height: thickness,
            depth: depth * 0.5
        }, scene);
        encastreBaseLateralTapaIzquierdo.position.x = widthOfBaseTapa / 2 + thickness / 2;
        encastreBaseLateralTapaIzquierdo.position.y = height / 2 - thickness / 2;
        encastreBaseLateralTapaIzquierdo.position.z = 0;    
        encastreBaseLateralTapaIzquierdo.material = material;
        //encastre izquierdo cara de tapa izquierda
        encastreIzqTapIzquierda = BABYLON.MeshBuilder.CreateBox("encastreIzqTapIzquierda", {
            width: thickness,
            height: 0.075,
            depth: thickness
        }, scene);
        encastreIzqTapIzquierda.position.x = widthOfBaseTapa / 2 + thickness / 2;
        encastreIzqTapIzquierda.position.y = posicionYbaseTata - 0.06;
        encastreIzqTapIzquierda.position.z = depthOfBaseTapa/2 + thickness/2;
        //encastre derecho cara de tapa izquierda
        encastreDerTapIzquierda = BABYLON.MeshBuilder.CreateBox("encastreDerTapIzquierda", {
            width: thickness,
            height: 0.075,
            depth: thickness
        }, scene);
        encastreDerTapIzquierda.position.x = widthOfBaseTapa / 2 + thickness / 2;
        encastreDerTapIzquierda.position.y = posicionYbaseTata - 0.06;
        encastreDerTapIzquierda.position.z = -depthOfBaseTapa/2 - thickness/2;




        //Crear lado derecho de la base de la caja  
        derechaTapa = BABYLON.MeshBuilder.CreateBox("derechaTapa", { width: thickness, height: 0.15, depth: depthOfBaseTapa + (thickness*2) }, scene);
        derechaTapa.position.x = -widthOfBaseTapa / 2 - thickness / 2;
        derechaTapa.position.y = posicionYbaseTata - 0.06;
        derechaTapa.position.z = 0;
        derechaTapa.material = material;

        //Crear un encastre lado derecho de tapa centrado
        encastreBaseLateralTapaDerecho = BABYLON.MeshBuilder.CreateBox("encastreBaseLateralTapaDerecho", {
            width: thickness,
            height: thickness,
            depth: depth * 0.5
        }, scene);
        encastreBaseLateralTapaDerecho.position.x = -widthOfBaseTapa / 2 - thickness / 2;
        encastreBaseLateralTapaDerecho.position.y = height / 2 - thickness / 2;
        encastreBaseLateralTapaDerecho.position.z = 0;    
        encastreBaseLateralTapaDerecho.material = material;
        //encastre izquierdo cara de tapa derecha
        encastreIzqTapDerecha = BABYLON.MeshBuilder.CreateBox("encastreIzqTapDerecha", {
            width: thickness,
            height: 0.075,
            depth: thickness
        }, scene);
        encastreIzqTapDerecha.position.x = -widthOfBaseTapa / 2 - thickness / 2;
        encastreIzqTapDerecha.position.y = posicionYbaseTata - 0.06;
        encastreIzqTapDerecha.position.z = depthOfBaseTapa/2 + thickness/2;
        //encastre derecho cara de tapa derecha
        encastreDerTapDerecha = BABYLON.MeshBuilder.CreateBox("encastreDerTapDerecha", {
            width: thickness,
            height: 0.075,
            depth: thickness
        }, scene);
        encastreDerTapDerecha.position.x = -widthOfBaseTapa / 2 - thickness / 2;
        encastreDerTapDerecha.position.y = posicionYbaseTata - 0.06;
        encastreDerTapDerecha.position.z = -depthOfBaseTapa/2 - thickness/2;


        // Realizar operaciones booleanas de la tapa
        const baseTapaCSG = BABYLON.CSG.FromMesh(baseTapa);
        const encastreBaseTapaDelanteCSG = BABYLON.CSG.FromMesh(encastreBaseTapaDelante);
        const encastreBaseTapaTraseroCSG = BABYLON.CSG.FromMesh(encastreBaseTapaTrasero);
        const encastreBaseTapaIzquierdoCSG = BABYLON.CSG.FromMesh(encastreBaseTapaIzquierdo);
        const encastreBaseTapaDerechoCSG = BABYLON.CSG.FromMesh(encastreBaseTapaDerecho);


        const delanteraTapaCSG = BABYLON.CSG.FromMesh(delanteraTapa);
        const encastreBaseLateralTapaDelanteCSG = BABYLON.CSG.FromMesh(encastreBaseLateralTapaDelante);
        const encastreIzqSupTapDelanteCSG = BABYLON.CSG.FromMesh(encastreIzqSupTapDelante); 
        const encastreIzqinfTapDelanteCSG = BABYLON.CSG.FromMesh(encastreIzqinfTapDelante);
        const encastreDerSupTapDelanteCSG = BABYLON.CSG.FromMesh(encastreDerSupTapDelante); 
        const encastreDerinfTapDelanteCSG = BABYLON.CSG.FromMesh(encastreDerinfTapDelante);
        

        const traseraTapaCSG = BABYLON.CSG.FromMesh(traseraTapa);
        const encastreBaseLateralTapaTraseroCSG = BABYLON.CSG.FromMesh(encastreBaseLateralTapaTrasero);
        const encastreIzqSupTapTraseroCSG = BABYLON.CSG.FromMesh(encastreIzqSupTapTrasero); 
        const encastreIzqinfTapTraseroCSG = BABYLON.CSG.FromMesh(encastreIzqinfTapTrasero);
        const encastreDerSupTapTraseroCSG = BABYLON.CSG.FromMesh(encastreDerSupTapTrasero); 
        const encastreDerinfTapTraseroCSG = BABYLON.CSG.FromMesh(encastreDerinfTapTrasero);

        const izquierdaTapaCSG = BABYLON.CSG.FromMesh(izquierdaTapa);
        const encastreBaseLateralTapaIzquierdoCSG = BABYLON.CSG.FromMesh(encastreBaseLateralTapaIzquierdo);
        const encastreIzqTapIzquierdaCSG = BABYLON.CSG.FromMesh(encastreIzqTapIzquierda);
        const encastreDerTapIzquierdaCSG = BABYLON.CSG.FromMesh(encastreDerTapIzquierda);


        const derechaTapaCSG = BABYLON.CSG.FromMesh(derechaTapa);
        const encastreBaseLateralTapaDerechoCSG = BABYLON.CSG.FromMesh(encastreBaseLateralTapaDerecho);
        const encastreIzqTapDerechaCSG = BABYLON.CSG.FromMesh(encastreIzqTapDerecha);
        const encastreDerTapDerechaCSG = BABYLON.CSG.FromMesh(encastreDerTapDerecha);

        const baseTapaWithHoleCSG = baseTapaCSG.union(encastreBaseTapaDelanteCSG).union(encastreBaseTapaTraseroCSG).union(encastreBaseTapaIzquierdoCSG).union(encastreBaseTapaDerechoCSG);

        const delenteraTapaWithHoleCSG = delanteraTapaCSG.subtract(encastreBaseLateralTapaDelanteCSG).subtract(encastreIzqSupTapDelanteCSG).subtract(encastreIzqinfTapDelanteCSG).subtract(encastreDerSupTapDelanteCSG).subtract(encastreDerinfTapDelanteCSG);

        const traseraTapaWithHoleCSG = traseraTapaCSG.subtract(encastreBaseLateralTapaTraseroCSG).subtract(encastreIzqSupTapTraseroCSG).subtract(encastreIzqinfTapTraseroCSG).subtract(encastreDerSupTapTraseroCSG).subtract(encastreDerinfTapTraseroCSG);

        const izquierdaTapaWithHoleCSG = izquierdaTapaCSG.subtract(encastreBaseLateralTapaIzquierdoCSG).subtract(encastreIzqTapIzquierdaCSG).subtract(encastreDerTapIzquierdaCSG);

        const derechaTapaWithHoleCSG = derechaTapaCSG.subtract(encastreBaseLateralTapaDerechoCSG).subtract(encastreIzqTapDerechaCSG).subtract(encastreDerTapDerechaCSG);

        
        const finalBaseTapa = baseTapaWithHoleCSG.toMesh("finalBaseTapa", material , scene);
        const finaldelenteraTapa = delenteraTapaWithHoleCSG.toMesh("finaldelenteraTapa", material , scene);
        const finaltraseraTapa = traseraTapaWithHoleCSG.toMesh("finaltraseraTapa", material , scene);
        const finalizquierdaTapa = izquierdaTapaWithHoleCSG.toMesh("finalizquierdaTapa", material , scene);
        const finalderechaTapa = derechaTapaWithHoleCSG.toMesh("finalderechaTapa", material , scene);
        
        finalBaseTapa.updateFacetData();
        finaldelenteraTapa.updateFacetData();
        finaltraseraTapa.updateFacetData();
        finalizquierdaTapa.updateFacetData();
        finalderechaTapa.updateFacetData();


        // Asignar los materiales a las diferentes partes de la tapa
        finalBaseTapa.material = materialBase;
        finaldelenteraTapa.material = materialDelantera;
        finaltraseraTapa.material = materialBack;
        finalizquierdaTapa.material = materialIzquierda;
        finalderechaTapa.material = materialDerecha;


        // Eliminar mallas temporales
        baseTapa.dispose();
        encastreBaseTapaDelante.dispose();
        encastreBaseTapaTrasero.dispose();
        encastreBaseTapaIzquierdo.dispose();
        encastreBaseTapaDerecho.dispose();

        delanteraTapa.dispose();
        encastreBaseLateralTapaDelante.dispose();
        encastreIzqSupTapDelante.dispose();
        encastreIzqinfTapDelante.dispose();
        encastreDerSupTapDelante.dispose();
        encastreDerinfTapDelante.dispose();

        traseraTapa.dispose();
        encastreBaseLateralTapaTrasero.dispose();
        encastreIzqSupTapTrasero.dispose();
        encastreIzqinfTapTrasero.dispose();
        encastreDerSupTapTrasero.dispose();
        encastreDerinfTapTrasero.dispose();

        izquierdaTapa.dispose();
        encastreBaseLateralTapaIzquierdo.dispose();
        encastreIzqTapIzquierda.dispose();
        encastreDerTapIzquierda.dispose();


        derechaTapa.dispose();
        encastreBaseLateralTapaDerecho.dispose();
        encastreIzqTapDerecha.dispose();
        encastreDerTapDerecha.dispose();
  

        // Llamar a la función de animación solo si existe la tapa
        animateLid(finalBaseTapa, scene);
        animateLid(finaldelenteraTapa, scene);
        animateLid(finaltraseraTapa, scene);
        animateLid(finalizquierdaTapa, scene);
        animateLid(finalderechaTapa, scene);

    } else if (baseTapa) {
        // Si `withLid` es falso y baseTapa ya existe, entonces la eliminamos
        baseTapa.dispose();
        baseTapa = null;

        encastreBaseTapaDelante.dispose();
        encastreBaseTapaDelante = null;

        encastreBaseTapaTrasero.dispose();
        encastreBaseTapaTrasero = null;

        encastreBaseTapaIzquierdo.dispose();
        encastreBaseTapaIzquierdo = null;

        encastreBaseTapaDerecho.dispose();
        encastreBaseTapaDerecho = null;


        delanteraTapa.dispose();
        delanteraTapa = null;

        encastreBaseLateralTapaDelante.dispose()
        encastreBaseLateralTapaDelante = null;

        encastreIzqSupTapDelante.dispose()
        encastreIzqSupTapDelante = null;
        encastreIzqinfTapDelante.dispose()
        encastreIzqinfTapDelante = null;
        encastreDerSupTapDelante.dispose()
        encastreDerSupTapDelante = null;
        encastreDerinfTapDelante.dispose()
        encastreDerinfTapDelante = null;

        traseraTapa.dispose();
        traseraTapa = null;

        encastreBaseLateralTapaTrasero.dispose()
        encastreBaseLateralTapaTrasero = null;

        encastreIzqSupTapTrasero.dispose()
        encastreIzqSupTapTrasero = null;
        encastreIzqinfTapTrasero.dispose()
        encastreIzqinfTapTrasero = null;
        encastreDerSupTapTrasero.dispose()
        encastreDerSupTapTrasero = null;
        encastreDerinfTapTrasero.dispose()
        encastreDerinfTapTrasero = null;


        izquierdaTapa.dispose();
        izquierdaTapa = null;

        encastreBaseLateralTapaIzquierdo.dispose()
        encastreBaseLateralTapaIzquierdo = null;

        encastreIzqTapIzquierda.dispose()
        encastreIzqTapIzquierda = null;
        encastreDerTapIzquierda.dispose()
        encastreDerTapIzquierda = null;

        derechaTapa.dispose();
        derechaTapa = null;

        encastreBaseLateralTapaDerecho.dispose()
        encastreBaseLateralTapaDerecho = null;     
        
        encastreIzqTapDerecha.dispose()
        encastreIzqTapDerecha = null;   
        encastreDerTapDerecha.dispose()
        encastreDerTapDerecha = null;   
        
    }


    return scene;
};

// Función para generar la caja (usada tanto en el botón como en el checkbox)
const generateBox = () => {
    const width = parseFloat(document.getElementById("width").value) / 100;
    const height = parseFloat(document.getElementById("height").value) / 100;
    const depth = parseFloat(document.getElementById("depth").value) / 100;
    const thickness = parseFloat(document.getElementById("thickness").value) / 100;

    // Obtener el estado del checkbox "Con tapa"
    const withLid = document.getElementById("withLid").checked;

    // Crear la escena con o sin tapa según el estado del checkbox
    const scene = createScene(width, height, depth, thickness, withLid);
    engine.runRenderLoop(() => scene.render());
};

// Escuchar el evento de envío del formulario
document.getElementById("boxForm").addEventListener("submit", (e) => {
    e.preventDefault();
    generateBox();
});

// Escuchar el evento de cambio en el checkbox "Con tapa" para actualizar la caja automáticamente
document.getElementById("withLid").addEventListener("change", () => {
    generateBox();
});

window.addEventListener("resize", () => engine.resize());
