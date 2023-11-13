import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import LoadingPlaceholder from "../../components/LoadingPlaceholder/LoadingPlaceholder";
import Footer from "../../components/Footer/Footer";
import "./Typings.scss";

function Typings() {
  const { id } = useParams();
  const [typing, setTyping] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTyping() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTyping(data);
        } else {
          console.error("Error fetching type:", response.status);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching type:", error);
        setLoading(false);
      }
      setLoading(false);
    }

    fetchTyping();
  }, [id]);

  console.log(typing);

  return (
    <>
      <Navbar />
      {loading && !typing ? (
        <LoadingPlaceholder />
      ) : (
        <div className="typings">
          <div className="typings-card">
            <div className="typings-intro">
              <div className="typings-card-title">
                <h3 className="typings-name">{id} type</h3>
              </div>
            </div>
            <div className="typing-matchups">
              <div className="double-damage-from">
                {typing.damage_relations.double_damage_from.length ===
                0 ? null : (
                  <p className="matchups-text">Takes double damage from:</p>
                )}
                <div className="double-damage-from-icons">
                  {typing.damage_relations.double_damage_from.map((type) => (
                    <Link key={type.name} to={`/typings/${type.name}`}>
                      <div className={`type-icon type-${type.name}`}>
                        {type.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="double-damage-to">
                {typing.damage_relations.double_damage_to.length ===
                0 ? null : (
                  <p className="matchups-text">Deals double damage to:</p>
                )}
                <div className="double-damage-to-icons">
                  {typing.damage_relations.double_damage_to.map((type) => (
                    <Link key={type.name} to={`/typings/${type.name}`}>
                      <div className={`type-icon type-${type.name}`}>
                        {type.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="half-damage-from">
                {typing.damage_relations.half_damage_from.length ===
                0 ? null : (
                  <p className="matchups-text">Takes reduced damage from:</p>
                )}
                <div className="half-damage-from-icons">
                  {typing.damage_relations.half_damage_from.map((type) => (
                    <Link key={type.name} to={`/typings/${type.name}`}>
                      <div className={`type-icon type-${type.name}`}>
                        {type.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="half-damage-to">
                {typing.damage_relations.half_damage_to.length === 0 ? null : (
                  <p className="matchups-text">Deals reduced damage to:</p>
                )}
                <div className="half-damage-to-icons">
                  {typing.damage_relations.half_damage_to.map((type) => (
                    <Link key={type.name} to={`/typings/${type.name}`}>
                      <div className={`type-icon type-${type.name}`}>
                        {type.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="no-damage-from">
                {typing.damage_relations.no_damage_from.length === 0 ? null : (
                  <p className="matchups-text">Takes no damage from:</p>
                )}
                <div className="no-damage-from-icons">
                  {typing.damage_relations.no_damage_from.map((type) => (
                    <Link key={type.name} to={`/typings/${type.name}`}>
                      <div className={`type-icon type-${type.name}`}>
                        {type.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="no-damage-to">
                {typing.damage_relations.no_damage_to.length === 0 ? null : (
                  <p className="matchups-text">Deals no damage to:</p>
                )}
                <div className="no-damage-to-icons">
                  {typing.damage_relations.no_damage_to.map((type) => (
                    <Link key={type.name} to={`/typings/${type.name}`}>
                      <div className={`type-icon type-${type.name}`}>
                        {type.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default Typings;
