// Obtener el lienzo y crear el motor de Babylon
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// Variable global para almacenar la tapa, si es creada
let baseTapa;
let encastreBaseTapaDelante;
let encastreBaseTapaIzquierdo;
let encastreBaseTapaDerecho;

const animateLid = (lidMesh, pivotPosition, scene) => { 
    // Crear la animación de rotación en el eje X
    const animation = new BABYLON.Animation(
        "lidAnimation", 
        "rotation.x", 
        30, // FPS
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, 
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Definir los fotogramas clave de la animación
    const keys = [];
    const originalRotation = lidMesh.rotation.x;
    keys.push({ frame: 0, value: originalRotation });               // Posición cerrada
    keys.push({ frame: 15, value: originalRotation - Math.PI / 2 });  // Abrir a 90 grados
    keys.push({ frame: 30, value: originalRotation });               // Volver a cerrarse

    // Asignar los fotogramas clave a la animación
    animation.setKeys(keys);

    // 📌 **Ajustar el pivote al centro de la perforación**
    lidMesh.setPivotPoint(pivotPosition);


    // Añadir la animación al mesh
    lidMesh.animations = [animation];

    // Iniciar la animación en bucle infinito
    scene.beginAnimation(lidMesh, 0, 30, true, 0.5);
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
        camera.radius = maxDimension * 3.5; // Ajusta el factor según lo necesites
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
    material.diffuseTexture = new BABYLON.Texture("/src/Wood037_2K-JPG_Color.jpg", scene);
    material.diffuseTexture.level = 1.5;
    material.bumpTexture = new BABYLON.Texture("/src/Wood037_2K-JPG_NormalGL.jpg", scene);
    material.roughness = 1;
    material.metallic = 0;
    material.diffuseColor = new BABYLON.Color3(1, 0.9, 0.75);

    ///////////////////////////////////////////////////////////////////
    // Crear materiales con diferencias de color más notables para cada cara y menos rugosidad
    const materialDelantera = new BABYLON.StandardMaterial("materialDelantera", scene);
    materialDelantera.diffuseTexture = new BABYLON.Texture("/src/Wood037_2K-JPG_Color.jpg", scene);
    materialDelantera.diffuseColor = new BABYLON.Color3(1, 0.85, 0.7);
    materialDelantera.roughness = 0.5;

    const materialBack = new BABYLON.StandardMaterial("materialBack", scene);
    materialBack.diffuseTexture = new BABYLON.Texture("/src/Wood037_2K-JPG_Color.jpg", scene);
    materialBack.diffuseColor = new BABYLON.Color3(0.95, 0.8, 0.65);
    materialBack.roughness = 0.5;

    const materialIzquierda = new BABYLON.StandardMaterial("materialIzquierda", scene);
    materialIzquierda.diffuseTexture = new BABYLON.Texture("/src/Wood037_2K-JPG_Color.jpg", scene);
    materialIzquierda.diffuseColor = new BABYLON.Color3(0.9, 0.75, 0.6);
    materialIzquierda.roughness = 0.5;

    const materialDerecha = new BABYLON.StandardMaterial("materialDerecha", scene);
    materialDerecha.diffuseTexture = new BABYLON.Texture("/src/Wood037_2K-JPG_Color.jpg", scene);
    materialDerecha.diffuseColor = new BABYLON.Color3(0.9, 0.75, 0.6);
    materialDerecha.roughness = 0.5;

    const materialBase = new BABYLON.StandardMaterial("materialBase", scene);
    materialBase.diffuseTexture = new BABYLON.Texture("/src/Wood037_2K-JPG_Color.jpg", scene);
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

    //crear visagra lado izquierdo
    const visagraLadoIzquierdo = BABYLON.MeshBuilder.CreateBox("visagraLadoIzquierdo", {width: thickness, height: ((thickness/3)*6.5), depth:((thickness/3)*10)}, scene);
    visagraLadoIzquierdo.position.x = width / 2 + thickness / 2;
    visagraLadoIzquierdo.position.y = height / 2 ;  
    visagraLadoIzquierdo.position.z = -(depth/2) + (thickness/3 * 2);
    visagraLadoIzquierdo.material = material;

    //crear perdoracion para visagra de lado izquierdo
    const perforacionVisagraIzquierda = BABYLON.MeshBuilder.CreateSphere("perforacionVisagraIzquierda", {diameter: (thickness/3)*5.5}, scene);
    perforacionVisagraIzquierda.position.x = width / 2 + thickness / 2;
    perforacionVisagraIzquierda.position.y = height / 2 - thickness/2;
    perforacionVisagraIzquierda.position.z = -(depth/2) + (thickness/3 * 1.5);
    perforacionVisagraIzquierda.material = material;


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
    
    //crear visagra lado Derecho
    const visagraLadoDerecho = BABYLON.MeshBuilder.CreateBox("visagraLadoDerecho", {width: thickness, height: ((thickness/3)*6.5), depth:((thickness/3)*10)}, scene);
    visagraLadoDerecho.position.x = -width / 2 - thickness / 2;
    visagraLadoDerecho.position.y = height / 2 ;  
    visagraLadoDerecho.position.z = -(depth/2) + (thickness/3 * 2);
    visagraLadoDerecho.material = material;
         
    //crear perdoracion para visagra de lado Derecho
    const perforacionVisagraDerecho = BABYLON.MeshBuilder.CreateSphere("perforacionVisagraDerecho", {diameter: (thickness/3)*5.5}, scene);
    perforacionVisagraDerecho.position.x = -width / 2 - thickness / 2;
    perforacionVisagraDerecho.position.y = height / 2 - thickness/2;
    perforacionVisagraDerecho.position.z = -(depth/2) + (thickness/3 * 1.5);
    perforacionVisagraDerecho.material = material;
    
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

    const visagraLadoIzquierdoCSG = BABYLON.CSG.FromMesh(visagraLadoIzquierdo);
    const perforacionVisagraIzquierdaCSG = BABYLON.CSG.FromMesh(perforacionVisagraIzquierda);


    const caraDerechaCSG = BABYLON.CSG.FromMesh(caraDerecha);
    const encastraseroInferiorCaraDerechoCSG = BABYLON.CSG.FromMesh(encastraseroInferiorCaraDerecho);
    const encastreSuperiorCaraDerechaSCG = BABYLON.CSG.FromMesh(encastreSuperiorCaraDerecha);
    const encastreInferiorCaraDerechaSCG = BABYLON.CSG.FromMesh(encastreInferiorCaraDerecha);
    const encastreSuperiorCaraDerecha2SCG = BABYLON.CSG.FromMesh(encastreSuperiorCaraDerecha2);
    const encastreInferiorCaraDerecha2SCG = BABYLON.CSG.FromMesh(encastreInferiorCaraDerecha2);
    const visagraLadoDerechoCSG = BABYLON.CSG.FromMesh(visagraLadoDerecho);
    const perforacionVisagraDerechoCSG = BABYLON.CSG.FromMesh(perforacionVisagraDerecho);

    const baseCSG = BABYLON.CSG.FromMesh(base);
    const encastraseroInferiorDelanteraBaseCSG = BABYLON.CSG.FromMesh(encastraseroInferiorDelanteraBase);
    const encastraseroInferiorTraseroBaseCSG = BABYLON.CSG.FromMesh(encastraseroInferiorTraseroBase);
    const encastraseroInferiorCaraIzquierdaBaseCSG = BABYLON.CSG.FromMesh(encastraseroInferiorCaraIzquierdaBase);
    const encastraseroInferiorCaraDerechoBaseCSG = BABYLON.CSG.FromMesh(encastraseroInferiorCaraDerechoBase);

    const delanteraWithHoleCSG = delanteraCSG.subtract(subtractCSGencastreInferiorDelantero).union(encastreIzqdelanteraCSG).union(encastreDerdelanteraCSG);

    const backWithHoleCSG = backCSG.subtract(subtractCSG).union(encastreIzqCSG).union(encastreDerCSG);

    const izquierdaWithHoleCSG = caraIzquierdaCSG.subtract(encastraseroInferiorCaraIzquierdaCSG).union(encastreSuperiorCaraIzquierdaSCG).union(encastreInferiorCaraIzquierdaSCG).union(encastreSuperiorCaraIzquierda2SCG).union(encastreInferiorCaraIzquierda2SCG).union(visagraLadoIzquierdoCSG).subtract(perforacionVisagraIzquierdaCSG);

    const derechaWithHoleCSG = caraDerechaCSG.subtract(encastraseroInferiorCaraDerechoCSG).union(encastreSuperiorCaraDerechaSCG).union(encastreInferiorCaraDerechaSCG).union(encastreSuperiorCaraDerecha2SCG).union(encastreInferiorCaraDerecha2SCG).union(visagraLadoDerechoCSG).subtract(perforacionVisagraDerechoCSG);

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
   //finalIzquierda.material = material;


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

    perforacionVisagraIzquierda.dispose();
    caraIzquierda.dispose();
    encastraseroInferiorCaraIzquierda.dispose();
    encastreSuperiorCaraIzquierda.dispose();
    encastreInferiorCaraIzquierda.dispose();
    encastreSuperiorCaraIzquierda2.dispose();
    encastreInferiorCaraIzquierda2.dispose();
    visagraLadoIzquierdo.dispose();
  
    perforacionVisagraDerecho.dispose();
    caraDerecha.dispose();
    encastraseroInferiorCaraDerecho.dispose();
    encastreSuperiorCaraDerecha.dispose();
    encastreInferiorCaraDerecha.dispose();
    encastreSuperiorCaraDerecha2.dispose();
    encastreInferiorCaraDerecha2.dispose();
    visagraLadoDerecho.dispose();
    

    base.dispose();
    encastraseroInferiorDelanteraBase.dispose();
    encastraseroInferiorTraseroBase.dispose();
    encastraseroInferiorCaraIzquierdaBase.dispose();
    encastraseroInferiorCaraDerechoBase.dispose();

    baseTapa = BABYLON.MeshBuilder.CreateBox("baseTapa", { width: (width + (thickness*2) + 0.015 )  , height: thickness, depth: (depth + (thickness)) }, scene);
    baseTapa.position.y = height / 2 - thickness / 2; // Colocar la tapa en la parte superior
    baseTapa.position.z = -((thickness/3 * 1.5)) + thickness; 
    baseTapa.material = material; // Asigna el material deseado para la tapa

    let widthOfBaseTapa = baseTapa.scaling.x * (width + (thickness*2) + 0.015);

    //Crear un encastre izquierdo de tapa
    encastreBaseTapaIzquierdo = BABYLON.MeshBuilder.CreateBox("encastreBaseTapaIzquierdo", {
        width: thickness + 0.015,
        height: thickness,
        depth: thickness*3
    }, scene);
    encastreBaseTapaIzquierdo.position.x = widthOfBaseTapa / 2 - thickness / 2;
    encastreBaseTapaIzquierdo.position.y = height / 2 - thickness / 2;
    encastreBaseTapaIzquierdo.position.z = -depth/2 + thickness + ((thickness/3)*4.5);    
    encastreBaseTapaIzquierdo.material = material;

    //Crear un encastre derecho de tapa
    encastreBaseTapaDerecho = BABYLON.MeshBuilder.CreateBox("encastreBaseTapaDerecho", {
        width: thickness + 0.015,
        height: thickness,
        depth: thickness*3
    }, scene);
    encastreBaseTapaDerecho.position.x = -widthOfBaseTapa / 2 + thickness / 2;
    encastreBaseTapaDerecho.position.y = height / 2 - thickness / 2;
    encastreBaseTapaDerecho.position.z = -depth/2 + thickness + ((thickness/3)*4);   
    encastreBaseTapaDerecho.material = material;


    // Realizar operaciones booleanas de la tapa
    const baseTapaCSG = BABYLON.CSG.FromMesh(baseTapa);
    const encastreBaseTapaIzquierdoCSG = BABYLON.CSG.FromMesh(encastreBaseTapaIzquierdo);
    const encastreBaseTapaDerechoCSG = BABYLON.CSG.FromMesh(encastreBaseTapaDerecho);

    const baseTapaWithHoleCSG = baseTapaCSG.subtract(encastreBaseTapaIzquierdoCSG).subtract(encastreBaseTapaDerechoCSG);

    const finalBaseTapa = baseTapaWithHoleCSG.toMesh("finalBaseTapa", material , scene);
 
    finalBaseTapa.updateFacetData();

    // Asignar los materiales a las diferentes partes de la tapa
    finalBaseTapa.material = materialBase;

    // Eliminar mallas temporales
    baseTapa.dispose();
    encastreBaseTapaIzquierdo.dispose();
    encastreBaseTapaDerecho.dispose();

    const pivotX = width / 2 + thickness;  // Centrado en X
    const pivotY = 0; // Centrado en Y
    const pivotZ = -(depth/2); // Alinear con la perforación

    const pivotPosition = new BABYLON.Vector3(pivotX, pivotY, pivotZ);
    animateLid(finalBaseTapa, pivotPosition, scene);

    return scene;

};

// Función para generar la caja
const generateBox = () => {
    const width = parseFloat(document.getElementById("width").value) / 100;
    const height = parseFloat(document.getElementById("height").value) / 100;
    const depth = parseFloat(document.getElementById("depth").value) / 100;
    const thickness = parseFloat(document.getElementById("thickness").value) / 100;

    // Crear la escena
    const scene = createScene(width, height, depth, thickness);
    engine.runRenderLoop(() => scene.render());
};

// Escuchar el evento de envío del formulario
document.getElementById("boxForm").addEventListener("submit", (e) => {
    e.preventDefault();
    generateBox();
});

window.addEventListener("resize", () => engine.resize());
