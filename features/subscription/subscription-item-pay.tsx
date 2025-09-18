import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
  ToastAndroid,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Souscription from "@/database/model/Souscription";
import Versement from "@/database/model/versement";
import { database } from "@/database/database";
import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";
import Kit from "@/database/model/Kit";
import { formatXOF, Rs, SIZES } from "@/shared/utils";
import SubscriptionEmptyPay from "./subscription-empty-pay";
import { agentStore } from "@/storage/MMKV";

type Props = {
  subscription: Souscription;
  payments: Versement[];
  kit: Kit;
};



function SubscriptionItemPay({ kit, payments: pay, subscription: sub }: Props) {
  console.log("SubscriptionItemPay props:", { pay });

  
  const [isShowHistoric, setIsShowHistoric] = useState(false);
  const [newPayment, setNewPayment] = useState("");
  const [showPayment, setSHowPayment] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  
  const {agent} = agentStore();



  const totalPaid = pay?.reduce((sum, p) => sum + p.montant, 0);

  const getStatusColor = (status: string) => {
    return status === "completed" ? "#4CAF50" : "#FF9800";
  };

  const getStatusIcon = (status: string) => {
    return status === "completed" ? "checkmark-circle" : "time";
  };

  async function handleAddPayment() {
    
   if(newPayment === "" || parseInt(newPayment) < 100 ){
     return  Alert.alert(
      "Montant invalide",
      "Veuillez entrer un montant supérieur à 100 FCFA"

     );
   }

   if(totalPaid + parseInt(newPayment) > kit.montantTotal){
     return Alert.alert(
        "Montant invalide",
        "Le montant total payé ne doit pas dépasser le montant total de la souscription",
     );
   }

    Keyboard.dismiss();
   

    setisLoading(true);
  try {
    return await database.write(async () => {
      const paid = await database.get<Versement>("versements").create((payment) => {
        payment.souscriptionId = sub.id;
        payment.agentId = agent?.agent?.id || '' ; // Make sure this agent exists
        payment.montant = parseInt(newPayment);
        payment.dateVersement = Date.now(); // Add the required date
        payment.createdAt = Date.now(); // Add created timestamp
      });
      ToastAndroid.show("Paiement éffectué", ToastAndroid.TOP);
      return paid;
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    console.error("Error details:", error?.message);
    throw error; // Re-throw to handle upstream
  }finally{
    setisLoading(false);
    setNewPayment("");
  }
}


  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {totalPaid === kit.montantTotal && <Ionicons name="star" size={24} color="#6C63FF" />}
          <Text style={styles.subscriptionName}>{kit.label} </Text>
        </View>
       
      </View>

      {/* Subscription Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons
              style={styles.detailItemIcon}
              name="card"
              size={Rs(20)}
              color="#6C63FF"
            />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Prix total</Text>
              <Text style={styles.detailValue}>
                {formatXOF(kit.montantTotal)} 
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons style={styles.detailItemIcon} name="cash" size={Rs(20)} color="#4CAF50" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Total payé</Text>
              <Text style={styles.detailValue}>{formatXOF(totalPaid)}</Text>
            </View>
          </View>
         
        </View>

        <View style={styles.detailRow}>
           <View style={styles.detailItem}>
            <Ionicons style={styles.detailItemIcon} name="wallet" size={Rs(20)} color="#FF6B6B" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Reste à payer</Text>
              <Text style={styles.detailValue}>
                {formatXOF(kit.montantTotal - totalPaid)}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Ionicons style={styles.detailItemIcon} name="calendar" size={Rs(20)} color="#FF9800" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Dernier versement</Text>
              <Text style={styles.detailValue}>
                { pay?.length  && formatXOF(pay[pay?.length - 1]?.montant)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Payment Input */}
     { totalPaid < kit.montantTotal && <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Ajouter un versement</Text>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="card"
              size={20}
              color="#6C63FF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Entrez le montant"
              placeholderTextColor="#999"
              value={newPayment}
              onChangeText={setNewPayment}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPayment}>
           {!isLoading ? 
           <Ionicons name="add" size={20} color="white" /> :
            <ActivityIndicator size="small" color="white" />
          }
          </TouchableOpacity>
        </View>
      </View>}

      {/* Payment History */}
      <View style={styles.paymentSection}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={styles.sectionTitle}>Historique de versement</Text>
          <TouchableOpacity onPress={() => {
            setIsShowHistoric(!isShowHistoric)
            setSHowPayment(!showPayment)
            }}>
            <Feather name={isShowHistoric ? "eye" :"eye-off"} size={24} color="#6C63FF" />
          </TouchableOpacity>
        </View>
        {showPayment && (
          <View style={styles.paymentList}>
            {pay.length > 0 && pay?.map((payment) => (
              <View key={payment.id} style={styles.paymentItem}>
                <View style={styles.paymentLeft}>
                  <Ionicons
                    name={getStatusIcon('completed')}
                    size={20}
                    color={getStatusColor('completed')}
                  />
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentAmount}>
                      {formatXOF(payment.montant)}
                    </Text>
                    <Text style={styles.paymentDate}>
                      {new Date(payment.dateVersement).toLocaleDateString()} à
                      {' '}
                      {new Date(payment.dateVersement).toLocaleTimeString()}
                      </Text>
                  </View>
                </View>
               
              </View>
            ))}

           {pay.length === 0 && <SubscriptionEmptyPay />}
          </View>
        )}
      </View>
    </View>
  );
}


const enhance = withObservables(
  ["subscription"],
  ({ subscription }: { subscription: Souscription }) => ({
    subscription: subscription,
    payments: database.collections
      .get<Versement>("versements")
      .query(
        Q.where("souscription_id", subscription.id),
        Q.sortBy("created_at", Q.desc) // Sort by creation date
      )
      .observe(),

    kit: database.collections
      .get<Kit>("kits")
      .findAndObserve(subscription.kitId),
  })
);

export default enhance(SubscriptionItemPay);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  subscriptionName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3436",
    marginLeft: 8,
  },
  monthlyPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6C63FF",
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: Rs(6),
    borderRadius: 8,
    marginHorizontal: 4,
    height: Rs(100),
  },
  detailItemIcon: {
     position: "absolute",
     left: Rs(15),
      top: Rs(10),
      
    },
  detailText: {
    marginLeft: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: "#636E72",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: SIZES.mx,
    fontWeight: "600",
    color: "#2D3436",
  },
  inputSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#2D3436",
  },
  addButton: {
    backgroundColor: "#6C63FF",
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentSection: {
    marginBottom: 8,
  },
  paymentList: {
    marginTop: 8,
  },
  paymentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentInfo: {
    marginLeft: 12,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
  },
  paymentDate: {
    fontSize: 12,
    color: "#636E72",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
