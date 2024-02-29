import React, { Component} from 'react'
import { Modal, View, Dimensions, StyleSheet, Platform} from "react-native";
import { Icon, Button,Text} from "native-base";
import store from '../../redux/store'
import {createToken, createId, setLocation} from '../../redux/actions'
import {server} from '../Api'
import NavigationService from '../../../NavigationService/NavigationService'
import { ScrollView } from 'react-native-gesture-handler';
export default class Condiciones extends Component{
    constructor(){
        super()
    }

    botones(){
        return(
            <View style={{marginLeft:Platform.OS==='ios'?140:120}}>
                <Button
                    style={{marginBottom:alto*0.01}} 
                    onPress={()=>this.props.cerrarTerminos(false)}
                    rounded
                    danger>
                        <Text style={{color:'white', textAlign:'center'}}>Cerrar</Text>
                </Button>
            </View>
        )
    }

    render(){
        return(
        <Modal
          visible={this.props.visible}
          transparent={true}
        >
          <View style={{
            flex:1,
            flexDirection:'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:'#000000c2'}}>
            <View 
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor:'#fff',
                borderRadius: 15,
                height:Dimensions.get('window').height,
                width:Dimensions.get('window').width*0.95
              }}
            >
                <ScrollView>
                <View style={{justifyContent:"center", width:'100%'}}>
                    <View style={[estilo.razon,{marginTop:Platform.OS==='ios'?30:5}]}>
                        <View style={{height:60}}></View>
                        <Text style={{fontSize:15, textAlign:'justify'}}>
                        {`TÉRMINOS Y CONDICIONES DE USO
\n•	A continuación, se detallan los términos y condiciones de uso de la APLICACION para dispositivos móviles APPOLO. 
•	Toda persona que ingrese, utilice o se registre en la Plataforma se considera Usuario de la misma. Para ello, [ cada vez que] [cuando] el Usuario haga uso de la Plataforma [debe haber leído y aceptado los presentes términos y condiciones] [se entenderá ha leído y aceptado los presentes términos y condiciones, los que acepta y suscribe al ingresar y hacer uso de la Plataforma por primera vez]. Los presentes términos y condiciones y sus modificaciones y adaptaciones realizadas por APPOLO de tiempo en tiempo (en adelante los “Términos y Condiciones”), serán aplicables cada vez que se utilice la Plataforma y se considerarán y entenderán aceptados por quien utilice la Plataforma.
•	La aceptación de los presentes Términos y Condiciones por el conductor y/o vehículos de alquiler debidamente matriculado y registrado conforme la legislación aplicable (en adelante el “CHOFER”) faculta y otorga mandato irrevocable a APPOLO para que ésta, en nombre y representación del CHOFER, cobre y perciba directamente de los Pasajeros las cantidades que éstos paguen como tarifa por los servicios de transporte prestados por el CHOFER, que resultaren pagados mediante tarjeta de crédito o débito debidamente registrada en la APLICACION APPOLO. 
•	APPOLO, debidamente representada, acepta el mandato que se le confiere por el presente en los términos señalados.
•	La relación entre el CHOFER y APPOLO (ambos, en conjunto, las “Partes”) se encuentra limitada exclusivamente a lo establecido en los presentes Términos y Condiciones teniendo en consideración:
•	I. Que el CHOFER es portador una Cedula de Identidad, Licencia de Conducir, ambos vigentes y cumple con todas las exigencias legales y reglamentarias necesarias para conducir un vehículo de motor.
•	II. El CHOFER es propietario o conductor del vehículo de motor registrado, con su documentación reglamentaria y cumple íntegramente con las condiciones técnicas necesarias y apropiadas para efectuar de manera segura, eficaz, en tiempo y confortable el servicio de transporte asignado. 
•	III. APPOLO declara ser una empresa dedicada principalmente a prestar servicios de creación, desarrollo, producción, comercialización y prestación de servicios de Internet, servicios electrónicos y digitales, aplicaciones móviles, programas informáticos y software para cualquier tipo de dispositivo contactando a los usuarios que se registran como pasajeros (en adelante los “Pasajeros”) en su página Web y/o en su aplicación  y a las empresas que suscriben un convenio corporativo con APPOLO (“Empresas”) que requieren un servicio de geolocalización de servicios de transporte para que sus trabajadores, dependientes, funcionarios o empleados (“Personal”), con el chofer más próximo a su ubicación que se encuentre debidamente registrado en su página Web y/o en su Aplicación, con el propósito de optimizar el requerimiento de servicios de chofer por parte de los Pasajeros y Empresas.
•	Para tales efectos, APPOLO presta Servicios de Intermediación a través de la promoción y difusión de los servicios de transporte que prestan los chóferes debidamente registrados en su página Web y/o en su Aplicación para la contratación de sus servicios con el público en general y Empresas.
•	IV. El CHOFER tiene la intención de recibir de APPOLO los Servicios de Intermediación a través de la promoción y difusión de los servicios de transporte del chofer con el público en general y con Empresas a través de los servicios descritos anteriormente, contactando a los Pasajeros y Empresas y actuando como agente de cobranza de la tarifa por los servicios de transporte por cuenta del chofer, cuando corresponda de conformidad con lo establecido en el presente instrumento.
•	V. El CHOFER declara que toda la información suministrada y consignada en el presente es veraz correcta y actualizada.
•	OBJETO.
•	El CHOFER contrata los Servicios de Intermediación ofrecidos por APPOLO a través de su Aplicación, quien se obliga a prestarlos a través de la promoción y difusión de los servicios de transporte del CHOFER al público en general y a Empresas, contactando a los Pasajeros y Empresas y actuando como agente de cobranza de la tarifa por los servicios de transporte por cuenta del CHOFER, cuando proceda, en los términos y bajo las condiciones aquí estipuladas (“Servicios de Intermediación”).
•	ROL DE INTERMEDIADOR.
•	De manera general el papel desarrollado por APPOLO en virtud del presente acuerdo consiste en poner en disposición del CHOFER y de los pasajeros usuarios de la APLICACIÓN, en condición de intermediario, un espacio virtual con el fin que celebren entre ellos un contrato de transporte de personas, sin estar vinculado con el CHOFER o con los pasajeros usuarios, por ningún tipo de vinculación incluyendo, sin limitación relaciones de colaboración, dependencia, mandato y/o representación.
•	Se aclara que APPOLO mediante la Aplicación no presta servicios de transporte. Tampoco es un operador de transporte ni posee una flota de vehículos; simplemente permite el uso a los pasajeros usuarios de la Aplicación. Por lo que se declara expresamente que no existe entre APPOLO y/o sus representantes legales o accionistas, relación ni vínculo laboral alguno, relación de mandato ni representación con los CHOFER ni con los pasajeros usuarios.
•	Específicamente para los modelos de negocios denominados “CORPORATIVO” y “PAGO CON TARJETA” que se explicarán en las siguientes cláusulas, APPOLO podrá actuar simultáneamente como mandatario representante del CHOFER únicamente en lo que corresponde a la recepción o cobro de los pagos que se cause a favor del CHOFER por los servicios prestados.  En ningún caso en virtud de este contrato APPOLO contratará en nombre propio los servicios del CHOFER.
•	PROCEDIMIENTO
•	El procedimiento mediante el cual se pondrá en relación a los pasajeros con el CHOFER dependerá de alguno de los modelos de negocio escogido por el pasajero para solicitar el servicio que se enumeran en la cláusula sexta.
•	ACTIVACIÓN
•	Luego de que APPOLO verifique los datos y documentos, así como la veracidad de la información entregada, documentos y datos que son de responsabilidad exclusiva del CHOFER, se procederá a activar la Aplicación para uso exclusivo del CHOFER.
•	MODELOS DE NEGOCIO Y TARIFAS
•	APPOLOTAXI se reserva el derecho a modificar, ampliar, reducir y/o establecer una nueva modalidad de pago en cualquier momento según estime conveniente para el correcto funcionamiento del servicio. Los cambios generados en virtud de lo anterior serán debidamente informados al CHOFER (por medio de correo electrónico, aceptación de términos y condiciones y/o cualquier otro medio idóneo).
•	MODELO GENERAL: APPOLO permitirá a los pasajeros usuarios registrarse en su Plataforma y solicitar desde su dispositivo móvil, servicios de transporte de personas.  La Plataforma transmitirá la ubicación de los usuarios al dispositivo móvil del CHOFER y le dará la opción de aceptar la solicitud formulada por los usuarios para prestar sus servicios acudiendo a la ubicación señalada.  El pago de los servicios de acuerdo con este modelo de negocio será efectuado directamente al CHOFER por parte de los pasajeros y el pago de la comisión de APPOLO se descontará del saldo a favor que tenga el taxista en su cuenta.
•	En los pagos efectuados bajo esta modalidad APPOLO no intervendrá como mandatario ni agente de cobro de los CHOFER.
•	PAGO CON TARJETA: Es un servicio prestado al usuario pasajero para permitir el pago de los servicios de taxi con tarjetas de débito o crédito, por medio de un tercero proveedor de servicios de pagos vinculado con la APLICACIÓN. En este modelo de negocio APPOLO podrá actuar como mandatario del CHOFER para encargar al proveedor del servicio de pagos la recepción de los pagos de los pasajeros. En contraprestación de los Servicios de Intermediación el CHOFER pagará a APPOLO una comisión establecida por la empresa sobre la tarifa cobrada por el CHOFER al pasajero.
•	OBLIGACIONES DE APPOLO
•	En virtud del presente acuerdo APPOLO estará especialmente obligado a facilitar al CHOFER su registro en la APLICACIÓN y el uso de la misma mientras la cuenta del CHOFER permanezca activa, sin perjuicio que APPOLO pueda cancelar o suspender la cuenta en cualquier momento sin necesidad de justificación alguna y mantener en su página Web las tarifas y comisiones actualizadas
•	OBLIGACIONES DEL CHOFER
•	1. Mantener vigentes todos los permisos, seguros y cualquier otra exigencia que resulte necesaria para la prestación de los servicios de transporte de conformidad con la normativa legal y reglamentaria vigente.
•	2. El CHOFER será único y exclusivo responsable de toda y cualquier infracción a la normativa vigente en que incurra con ocasión de la prestación de los servicios de transporte, siendo de su exclusivo cargo el pago de eventuales multas, sanciones e indemnizaciones que pudieren derivarse de dichas infracciones.
•	3. El CHOFER está obligado a respetar el código de conducta y los términos de servicio del APPOLO.
•	IMPUESTOS Y RETENCIONES
•	Para aquellos casos en que los hubiere, cada CHOFER será el responsable de pagar los impuestos y practicar las retenciones que correspondan de acuerdo con la ley.
•	INDEMNIDAD.
•	El CHOFER libera expresamente a APPOLO, en forma total y absoluta, de toda y cualquier responsabilidad derivada del incumplimiento de las obligaciones previstas en el presente acuerdo y/o en la normativa vigente y/o de los efectos de dicho incumplimiento, o de daños o lesiones sufridos por el CHOFER, los Pasajeros, terceros o el medio ambiente a causa o con ocasión de la prestación de los servicios de transporte, cualquiera sea su tipo, naturaleza y alcance, obligándose a mantenerle completamente indemne de toda responsabilidad o molestia, obligándose a asumir directamente, o bien, reembolsar de inmediato a APPOLO de todo y cualquier pago que esta última se viera en la necesidad o conveniencia de efectuar por tal concepto. En el evento de que un tercero vinculado o no convencionalmente con el CHOFER, reclame daños y perjuicios o lesión sufrida a causa o con ocasión de la prestación de los servicios de transporte, el CHOFER deberá mantener completamente indemne a APPOLO y asumir directamente, o bien, reembolsar de inmediato a APPOLO, de toda indemnización y de todo pago o gasto en que incurriere con motivo de su defensa.
•	IMPUESTOS Y RETENCIONES.
•	Cada contratante será el responsable de pagar los impuestos y practicar las retenciones que correspondan de acuerdo con la ley.
•	CONTRATACIÓN TERCEROS
•	APPOLO podrá, a su cargo y bajo su responsabilidad, celebrar los contratos que considere convenientes o necesarios, así como valerse de terceros para cumplir con las obligaciones que asume conforme con la presente Oferta, sin perjuicio de lo cual APPOLO será el único y exclusivo responsable frente al CHOFER de la debida ejecución y cumplimiento de las obligaciones derivadas del mismo
•	RESPONSABILIDAD RELACIÓN LABORAL
•	Las Partes dejan expresa constancia de que la suscripción de este formulario no crea ningún tipo de vínculo laboral de subordinación ni relación de dependencia entre ellas ni entre ellas y las personas que se encuentren a su cargo, en su caso, declarando las Partes que el presente acuerdo da lugar a una prestación de servicios de carácter comercial, por lo que en ningún caso podrá ser considerado o asimilado a un contrato de trabajo regido por la legislación laboral
•	CONFIDENCIALIDAD Y DERECHO DE USO DE MARCAS
•	1. El CHOFER quedará obligado a no reproducir, divulgar, informar o dar a conocer, bajo ninguna circunstancia ni a persona alguna, salvo autorización expresa, anticipada y por escrito de APPOLO, toda o cualesquiera información financiera, legal, administrativa, técnica, profesional o de cualquier otra naturaleza relacionada con los Servicios de Intermediación ni con la actividad desarrollada por APPOLO (“Información Confidencial”).
•	2. Las obligaciones referidas no regirán si media alguna disposición legal o resolución judicial o acto de autoridad administrativa que obligue al CHOFER a someter materias sujetas al secreto y confidencialidad antes referidas, a conocimiento de los tribunales de justicia, instituciones, jueces árbitros o entidades facultadas por la ley y que actúen dentro de sus atribuciones, debiendo dar noticia de ello a APPOLO antes de su cumplimiento.
•	4. El uso de parte o de la totalidad de la Información Confidencial por parte del CHOFER sin autorización expresa y por escrito de APPOLO, dará lugar a la indemnización de perjuicios a que resulte procedente, sin perjuicio de los demás derechos que le corresponden a APPOLO de conformidad con lo dispuesto en este formulario y la legislación vigente.
•	5. El CHOFER reconoce que APPOLO es la única titular y propietaria de las distintas marcas de fábrica y de servicios, emblemas, diseños, distintivos, logotipos, isotipos y combinación de colores con que se identifica y que los mismos no podrán utilizarse por el CHOFER sin el consentimiento por escrito de APPOLO.
•	En caso de terminación por cualquier causa, el CHOFER dejará en forma automática de usar y exhibir la marca de APPOLO, debiendo realizar todos los actos necesarios a fin de remover todas las marcas, emblemas, diseños, distintivos y/o símbolos de propiedad de APPOLO.
•	6. Las obligaciones previstas en esta Cláusula permanecerán vigentes aún después de la terminación de la Oferta, cualquiera fuera la causa de la extinción.
•	VIGENCIA
•	1. La relación jurídica y comercial derivada del presente acuerdo comenzará a regir el día en que la misma se tuviere por aceptada, y no estará sujeta a plazo.
•	2. Sin perjuicio de lo anterior, la relación jurídica y comercial derivada del presente acuerdo podrá terminar antes de la expiración de la vigencia convenida (i) en los casos previstos en la Cláusula siguiente; y, (ii) si APPOLO notifica al CHOFER de su intención de terminarla anticipadamente, en cualquier tiempo y sin expresión de causa, mediante carta documento, notificación escrita con aviso de recibo, mensaje de texto o correo electrónico, sin derecho a indemnización ni compensación alguna.
•	INCUMPLIMIENTO Y TÉRMINO ANTICIPADO
•	El incumplimiento por alguna de las Partes de cualquiera de las obligaciones que han asumido en virtud de acuerdo, que no fuere remediable, o que siéndolo no fuere remediado dentro de 48 horas de comunicado el incumplimiento a la parte incumplidora, dará derecho a la otra parte para poner inmediato término a la relación jurídica y comercial derivada del presente acuerdo mediante carta documento, mensaje de texto o correo electrónico de la parte incumplidora, sin necesidad de declaración judicial o administrativa alguna y sin derecho a indemnización ni compensación a la parte incumplidora.
•	CESIÓN
•	Las partes no podrán ceder en todo o en parte sus derechos y obligaciones derivados del presente acuerdo sin autorización previa y por escrito de la otra parte
•	DISPOSICIONES VARIAS
•	1. La validez, interpretación y cumplimiento de las disposiciones contenidas en este acuerdo se regirán por las leyes de derecho común de la República Dominicana. 
•	2. Si cualquiera de las disposiciones contenidas en este acuerdo se declarare nula, ilegal, inoponible, inexistente o anulable, la validez, legalidad, oponibilidad y existencia de las disposiciones restantes no se verán alteradas o perjudicadas por ese hecho.`}
                        </Text>
                        <View style={{height:60}}></View>
                    </View>
                </View>
                {this.botones()}
                </ScrollView>
            </View>
          </View>
        </Modal>
        )
    }
}

const alto = Dimensions.get('window').height
const ancho = Dimensions.get('window').width

const estilo = StyleSheet.create({
  
    text: {
        color:'white'
    },
    titulo:{
        width:Dimensions.get('window').width - 40,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        backgroundColor: '#E84546',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        flexDirection:'row'
    },
    razon:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        width:ancho*0.88
    },
    boton_1:{
        marginTop:1,
        height:30,
        width:Dimensions.get('window').width*0.3,
        backgroundColor:'#676767'
    },
    boton_2:{
        marginTop:1,
        height:30,
        justifyContent:'center',
        width:Dimensions.get('window').width*0.3
    },
    text_env:{

    },
    botones:{
        flexDirection:'row', 
        justifyContent:'center', 
        width:Dimensions.get('window').width*0.7
    },
    icono:{
        color:'black',
        fontSize:30
    },
    icon:{
        color:'green',
        fontSize:30
    }
})